import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { effectiveState, objectMap } from '../domain/sceneGraph.js';
import { createObjectView, disposeObjectView } from './ObjectViewFactory.js';

export class ThreeSceneAdapter {
  constructor({
    container,
    store,
    editorService,
    onPreviewTransform = () => {},
    onError = () => {},
  }) {
    this.container = container;
    this.store = store;
    this.editorService = editorService;
    this.onPreviewTransform = onPreviewTransform;
    this.onError = onError;
    this.objectViews = new Map();
    this.objectReference = null;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(store.getState().settings.backgroundColor);
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.05, 2000);
    this.camera.position.set(7, 5.5, 9);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio ?? 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.domElement.dataset.testid = 'viewport-canvas';
    container.append(this.renderer.domElement);
    this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbit.enableDamping = true;
    this.orbit.target.set(0, 1, 0);
    this.contentRoot = new THREE.Group();
    this.contentRoot.name = 'ForgeContent';
    this.scene.add(this.contentRoot);
    this.grid = new THREE.GridHelper(40, 40, 0x5a6470, 0x303640);
    this.grid.name = 'EditorGrid';
    this.scene.add(this.grid);
    this.axes = new THREE.AxesHelper(2.5);
    this.axes.name = 'EditorAxes';
    this.scene.add(this.axes);
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x252830, 2.2));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(6, 10, 7);
    keyLight.castShadow = true;
    this.scene.add(keyLight);
    this.transformControls = new TransformControls(this.camera, this.renderer.domElement);
    this.transformHelper = this.transformControls.getHelper();
    this.transformHelper.name = 'EditorTransformGizmo';
    this.scene.add(this.transformHelper);
    this.selectionHelper = new THREE.BoxHelper(undefined, 0x53b3ff);
    this.selectionHelper.name = 'EditorSelection';
    this.selectionHelper.visible = false;
    this.scene.add(this.selectionHelper);
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.dragStartTransform = null;
    this.boundPointerDown = (event) => this.#handlePointerDown(event);
    this.renderer.domElement.addEventListener('pointerdown', this.boundPointerDown);
    this.transformControls.addEventListener('dragging-changed', (event) => {
      this.orbit.enabled = !event.value;
    });
    this.transformControls.addEventListener('mouseDown', () => {
      const id = this.store.getState().selection.activeId;
      const object = this.store.getState().objects.find((entry) => entry.id === id);
      this.dragStartTransform = object ? structuredClone(object.transform) : null;
    });
    this.transformControls.addEventListener('objectChange', () => {
      const view = this.transformControls.object;
      if (!view) return;
      this.selectionHelper.setFromObject(view);
      this.onPreviewTransform(this.#viewTransform(view));
    });
    this.transformControls.addEventListener('mouseUp', () => {
      const view = this.transformControls.object;
      const id = this.store.getState().selection.activeId;
      if (!view || !id || !this.dragStartTransform) return;
      try {
        this.editorService.updateTransform(id, this.#viewTransform(view));
      } catch (error) {
        view.position.fromArray(this.dragStartTransform.position);
        view.rotation.set(
          ...this.dragStartTransform.rotation.radians,
          this.dragStartTransform.rotation.order,
        );
        view.scale.fromArray(this.dragStartTransform.scale);
        this.selectionHelper.setFromObject(view);
        this.onPreviewTransform(this.dragStartTransform);
        this.onError(error);
      } finally {
        this.dragStartTransform = null;
      }
    });
    this.unsubscribe = store.subscribe((state) => this.sync(state));
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.sync(store.getState());
    this.resize();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  static supportsWebGL2() {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2'));
  }

  #viewTransform(view) {
    return {
      position: view.position.toArray(),
      rotation: { order: 'XYZ', radians: [view.rotation.x, view.rotation.y, view.rotation.z] },
      scale: view.scale.toArray(),
    };
  }

  #handlePointerDown(event) {
    if (this.transformControls.dragging || event.button !== 0) return;
    const state = this.store.getState();
    const rectangle = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rectangle.left) / rectangle.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rectangle.top) / rectangle.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const selectableMeshes = [...this.objectViews.values()].filter(
      (view) => view.isMesh && view.visible,
    );
    const hit = this.raycaster.intersectObjects(selectableMeshes, false)[0]?.object;
    if (!hit) {
      this.editorService.select(null);
      return;
    }
    const id = hit.userData.selectionId ?? hit.userData.domainId;
    const effective = effectiveState(state.objects, id);
    if (effective.locked || !effective.visible) return;
    this.editorService.select(id, { additive: event.shiftKey });
  }

  sync(state) {
    if (state.objects !== this.objectReference) {
      this.objectReference = state.objects;
      this.#rebuild(state);
    }
    this.scene.background.set(state.settings.backgroundColor);
    this.#syncSelection(state);
  }

  #rebuild(state) {
    for (const child of [...this.contentRoot.children]) {
      this.contentRoot.remove(child);
      disposeObjectView(child);
    }
    this.objectViews.clear();
    const byId = objectMap(state.objects);
    for (const object of state.objects) {
      const view = createObjectView(object);
      this.objectViews.set(object.id, view);
    }
    for (const object of state.objects) {
      const view = this.objectViews.get(object.id);
      const parent = object.parentId ? this.objectViews.get(object.parentId) : this.contentRoot;
      parent.add(view);
      const effective = effectiveState(state.objects, object.id);
      view.visible = effective.visible;
      if (view.isMesh) {
        let selectionId = object.id;
        let current = object;
        while (current.parentId) {
          const parentObject = byId.get(current.parentId);
          if (!parentObject) break;
          selectionId = parentObject.id;
          current = parentObject;
        }
        view.userData.selectionId = selectionId;
      }
    }
  }

  #syncSelection(state) {
    const { selectedIds, activeId } = state.selection;
    const single = selectedIds.length === 1;
    const activeView = single ? this.objectViews.get(activeId) : null;
    if (activeView) {
      this.selectionHelper.setFromObject(activeView);
      this.selectionHelper.visible = true;
    } else {
      this.selectionHelper.visible = false;
    }
    const canTransform =
      single &&
      activeView &&
      state.ui.activeTool !== 'select' &&
      !effectiveState(state.objects, activeId).locked &&
      effectiveState(state.objects, activeId).visible;
    if (canTransform) {
      this.transformControls.attach(activeView);
      this.transformControls.setMode(state.ui.activeTool);
    } else {
      this.transformControls.detach();
    }
  }

  resize() {
    const rectangle = this.container.getBoundingClientRect();
    const width = Math.max(1, rectangle.width);
    const height = Math.max(1, rectangle.height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  setView(view) {
    const target = this.orbit.target;
    const distance = 10;
    const positions = {
      front: [0, target.y, distance],
      back: [0, target.y, -distance],
      left: [-distance, target.y, 0],
      right: [distance, target.y, 0],
      top: [0, distance, 0.001],
      bottom: [0, -distance, 0.001],
      perspective: [7, 5.5, 9],
    };
    this.camera.position.fromArray(positions[view] ?? positions.perspective);
    this.camera.lookAt(target);
    this.orbit.update();
  }

  frameSelection() {
    const activeView = this.objectViews.get(this.store.getState().selection.activeId);
    if (!activeView) return;
    const box = new THREE.Box3().setFromObject(activeView);
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    if (!Number.isFinite(sphere.radius)) return;
    this.orbit.target.copy(sphere.center);
    const distance = Math.max(2, sphere.radius * 3);
    const direction = this.camera.position.clone().sub(this.orbit.target).normalize();
    this.camera.position.copy(sphere.center).addScaledVector(direction, distance);
    this.orbit.update();
  }

  animate() {
    this.animationFrame = requestAnimationFrame(this.animate);
    this.orbit.update();
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    cancelAnimationFrame(this.animationFrame);
    this.unsubscribe?.();
    this.resizeObserver.disconnect();
    this.renderer.domElement.removeEventListener('pointerdown', this.boundPointerDown);
    this.transformControls.dispose();
    this.orbit.dispose();
    this.renderer.dispose();
  }
}
