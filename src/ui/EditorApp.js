import { sceneTriangleCount } from '../domain/model.js';
import { effectiveState, objectMap } from '../domain/sceneGraph.js';
import { AppError } from '../io/AppError.js';
import { GLBExportService, downloadBlob } from '../io/GLBExportService.js';
import { parseProjectText } from '../io/ProjectLoader.js';
import { assertValidProject } from '../io/ProjectValidator.js';
import { projectFromState, serializeProject } from '../io/ProjectSerializer.js';
import { ThreeSceneAdapter } from '../scene/ThreeSceneAdapter.js';

const byId = (id) => document.getElementById(id);
const degrees = (radians) => (radians * 180) / Math.PI;
const radians = (value) => (value * Math.PI) / 180;

export function isTypingTarget(target) {
  const tagName = target?.tagName?.toLocaleLowerCase();
  return (
    ['input', 'textarea', 'select'].includes(tagName) ||
    Boolean(target?.isContentEditable) ||
    target?.getAttribute?.('role') === 'textbox'
  );
}

function projectFilename(name, extension) {
  const sanitized = name
    .replace(/[<>:"/\\|?*\u0000-\u001f]/gu, '_')
    .trim()
    .slice(0, 100);
  return `${sanitized || 'forge-studio-project'}${extension}`;
}

export class EditorApp {
  constructor({ store, commandManager, editorService, templateRegistry }) {
    this.store = store;
    this.commandManager = commandManager;
    this.editorService = editorService;
    this.templateRegistry = templateRegistry;
    this.glbExporter = new GLBExportService();
    this.collapsedIds = new Set();
    this.statusText = '준비됨';
    this.unsubscribe = store.subscribe(() => this.render());
    this.#bindProjectActions();
    this.#bindToolbar();
    this.#bindAssets();
    this.#bindInspector();
    this.#bindGlobalEvents();
    this.renderTemplates();
    if (ThreeSceneAdapter.supportsWebGL2()) {
      this.sceneAdapter = new ThreeSceneAdapter({
        container: byId('viewport'),
        store,
        editorService,
        onPreviewTransform: (transform) => this.renderTransformValues(transform),
        onError: (error) => this.showError(error),
      });
    } else {
      byId('webgl-error').classList.remove('hidden');
      byId('empty-state').classList.add('hidden');
      this.showError(
        new AppError('WEBGL2_UNAVAILABLE', 'WebGL2를 지원하는 Chrome 또는 Edge가 필요합니다.'),
      );
    }
    this.render();
  }

  #bindProjectActions() {
    byId('new-project').addEventListener('click', () => this.newProject());
    byId('open-project').addEventListener('click', () => this.requestOpen());
    byId('save-project').addEventListener('click', () => this.saveProject());
    byId('export-glb').addEventListener('click', () => this.exportGlb());
    byId('project-file').addEventListener('change', (event) =>
      this.openSelectedFile(event.target.files?.[0]),
    );
    byId('dismiss-error').addEventListener('click', () =>
      byId('error-toast').classList.add('hidden'),
    );
  }

  #bindToolbar() {
    for (const button of document.querySelectorAll('[data-tool]')) {
      button.addEventListener('click', () => {
        this.editorService.setTool(button.dataset.tool);
        this.setStatus(`${button.textContent.trim()} 도구`);
      });
    }
    for (const button of document.querySelectorAll('[data-command]')) {
      button.addEventListener('click', () => this.runCommand(button.dataset.command));
    }
    byId('view-select').addEventListener('change', (event) => {
      this.sceneAdapter?.setView(event.target.value);
      this.setStatus(`${event.target.selectedOptions[0].textContent} 보기`);
    });
  }

  #bindAssets() {
    for (const button of document.querySelectorAll('[data-primitive]')) {
      button.addEventListener('click', () =>
        this.runAction(
          () => this.editorService.createPrimitive(button.dataset.primitive),
          'Primitive 생성됨',
        ),
      );
    }
    for (const button of document.querySelectorAll('[data-quick-template]')) {
      button.addEventListener('click', () => this.createTemplate(button.dataset.quickTemplate));
    }
    byId('template-search').addEventListener('input', () => this.renderTemplates());
    byId('template-category').addEventListener('change', () => this.renderTemplates());
  }

  #bindInspector() {
    byId('object-name').addEventListener('change', (event) =>
      this.runAction(() => this.editorService.renameSelected(event.target.value), '이름 변경됨'),
    );
    for (const input of document.querySelectorAll('[data-vector]')) {
      input.addEventListener('change', () => this.commitInspectorTransform());
    }
    for (const input of [
      byId('material-color'),
      byId('material-roughness'),
      byId('material-metalness'),
      byId('material-opacity'),
      byId('material-wireframe'),
      byId('material-flat'),
    ]) {
      input.addEventListener('change', () => this.commitInspectorMaterial());
    }
    byId('object-visible').addEventListener('change', (event) => {
      const id = this.store.getState().selection.activeId;
      this.runAction(
        () => this.editorService.setVisible([id], event.target.checked),
        event.target.checked ? '표시됨' : '숨겨짐',
      );
    });
    byId('object-locked').addEventListener('change', (event) => {
      const id = this.store.getState().selection.activeId;
      this.runAction(
        () => this.editorService.setLocked([id], event.target.checked),
        event.target.checked ? '잠김' : '잠금 해제됨',
      );
    });
  }

  #bindGlobalEvents() {
    this.boundKeydown = (event) => this.handleShortcut(event);
    window.addEventListener('keydown', this.boundKeydown);
    window.addEventListener('beforeunload', (event) => {
      if (!this.commandManager.isDirty) return;
      event.preventDefault();
      event.returnValue = '';
    });
  }

  createTemplate(templateId) {
    const definition = this.templateRegistry.get(templateId);
    this.runAction(
      () => this.editorService.createTemplate(templateId),
      `${definition.name} 템플릿 생성됨`,
    );
  }

  runAction(action, successMessage = '') {
    try {
      const result = action();
      if (successMessage) this.setStatus(successMessage);
      return result;
    } catch (error) {
      this.showError(error);
      return null;
    }
  }

  runCommand(command) {
    const actions = {
      duplicate: () => this.editorService.duplicateSelection(),
      delete: () => this.editorService.deleteSelection(),
      ground: () => this.editorService.groundAlignSelected(),
      group: () => this.editorService.groupSelection(),
      ungroup: () => this.editorService.ungroupSelected(),
      lock: () => this.editorService.toggleSelectedLocked(),
      hide: () => this.editorService.toggleSelectedVisibility(),
      undo: () => this.editorService.undo(),
      redo: () => this.editorService.redo(),
    };
    const labels = {
      duplicate: '복제됨',
      delete: '삭제됨',
      ground: '바닥에 맞춤',
      group: '그룹 생성됨',
      ungroup: '그룹 해제됨',
      lock: '잠금 상태 변경됨',
      hide: '표시 상태 변경됨',
      undo: '실행 취소',
      redo: '다시 실행',
    };
    const capability = this.editorService.capability(command);
    if (!capability.allowed) {
      this.setStatus(capability.reason);
      return false;
    }
    return this.runAction(actions[command], labels[command]) !== null;
  }

  async askDiscardChanges() {
    if (!this.commandManager.isDirty) return true;
    const dialog = byId('discard-dialog');
    dialog.returnValue = 'cancel';
    dialog.showModal();
    const returnValue = await new Promise((resolve) => {
      dialog.addEventListener('close', () => resolve(dialog.returnValue), { once: true });
    });
    return returnValue === 'discard';
  }

  async newProject() {
    if (!(await this.askDiscardChanges())) return;
    this.editorService.newProject();
    this.setStatus('새 프로젝트');
  }

  async requestOpen() {
    if (!(await this.askDiscardChanges())) return;
    byId('project-file').click();
  }

  async openSelectedFile(file) {
    if (!file) return;
    try {
      const text = await file.text();
      const result = parseProjectText(text, { filename: file.name });
      this.editorService.replaceProject(result.state);
      this.setStatus(result.migrated ? 'v0.5 프로젝트 migration 완료' : '프로젝트 열기 완료');
    } catch (error) {
      this.showError(error);
    } finally {
      byId('project-file').value = '';
    }
  }

  saveProject() {
    try {
      const project = projectFromState(this.store.getState());
      assertValidProject(project);
      const json = serializeProject(this.store.getState(), {
        now: project.project.updatedAt,
      });
      downloadBlob(
        new Blob([json], { type: 'application/json;charset=utf-8' }),
        projectFilename(project.project.name, '.forge.json'),
      );
      this.commandManager.markSaved();
      this.setStatus('프로젝트 저장 시작됨');
      this.render();
      return true;
    } catch (error) {
      this.showError(error);
      return false;
    }
  }

  async exportGlb() {
    const button = byId('export-glb');
    button.disabled = true;
    button.textContent = '내보내는 중…';
    try {
      const buffer = await this.glbExporter.exportArrayBuffer(this.store.getState().objects);
      downloadBlob(
        new Blob([buffer], { type: 'model/gltf-binary' }),
        projectFilename(this.store.getState().project.name, '.glb'),
      );
      this.setStatus('GLB 내보내기 완료');
    } catch (error) {
      this.showError(error);
    } finally {
      button.disabled = false;
      button.textContent = 'GLB 내보내기';
      this.render();
    }
  }

  commitInspectorTransform() {
    const id = this.store.getState().selection.activeId;
    if (!id) return;
    const values = (prefix) =>
      ['x', 'y', 'z'].map((axis) => Number(byId(`${prefix}-${axis}`).value));
    const transform = {
      position: values('position'),
      rotation: { order: 'XYZ', radians: values('rotation').map(radians) },
      scale: values('scale'),
    };
    this.runAction(
      () => this.editorService.updateTransform(id, transform, { merge: true }),
      'Transform 변경됨',
    );
  }

  commitInspectorMaterial() {
    const id = this.store.getState().selection.activeId;
    if (!id) return;
    this.runAction(
      () =>
        this.editorService.updateMaterial(
          id,
          {
            color: byId('material-color').value,
            roughness: Number(byId('material-roughness').value),
            metalness: Number(byId('material-metalness').value),
            opacity: Number(byId('material-opacity').value),
            wireframe: byId('material-wireframe').checked,
            flatShading: byId('material-flat').checked,
          },
          { merge: true },
        ),
      '재질 변경됨',
    );
  }

  handleShortcut(event) {
    if (isTypingTarget(event.target)) return;
    const key = event.key.toLocaleLowerCase();
    const modifier = event.ctrlKey || event.metaKey;
    if (modifier && key === 's') {
      if (this.saveProject()) event.preventDefault();
      return;
    }
    if (modifier && key === 'z') {
      const executed = this.runCommand(event.shiftKey ? 'redo' : 'undo');
      if (executed) event.preventDefault();
      return;
    }
    if (modifier && key === 'y') {
      if (this.runCommand('redo')) event.preventDefault();
      return;
    }
    if (modifier && key === 'd') {
      if (this.runCommand('duplicate')) event.preventDefault();
      return;
    }
    if (modifier && key === 'g') {
      if (this.runCommand(event.shiftKey ? 'ungroup' : 'group')) event.preventDefault();
      return;
    }
    if (key === 'delete' || key === 'backspace') {
      if (this.runCommand('delete')) event.preventDefault();
      return;
    }
    if (key === 'f') {
      this.sceneAdapter?.frameSelection();
      return;
    }
    const tools = { q: 'select', w: 'translate', e: 'rotate', r: 'scale' };
    if (tools[key]) this.editorService.setTool(tools[key]);
  }

  renderTemplates() {
    const category = byId('template-category').value;
    const query = byId('template-search').value;
    const definitions = this.templateRegistry.list({ category, query });
    const container = byId('template-grid');
    const cards = definitions.map((definition) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'template-card';
      button.dataset.testid = `template-${definition.templateId}`;
      button.title = `${definition.name} 생성`;
      const icon = document.createElement('span');
      icon.className = 'template-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = definition.icon;
      const copy = document.createElement('span');
      const name = document.createElement('strong');
      name.textContent = definition.name;
      const metadata = document.createElement('small');
      metadata.textContent = `${definition.parts.length} parts · ≤${definition.maxTriangles.toLocaleString()}`;
      copy.append(name, metadata);
      button.append(icon, copy);
      button.addEventListener('click', () => this.createTemplate(definition.templateId));
      return button;
    });
    container.replaceChildren(...cards);
    byId('template-count').textContent = String(definitions.length);
  }

  renderHierarchy(state) {
    const container = byId('hierarchy-tree');
    const byObjectId = objectMap(state.objects);
    const childrenByParent = new Map();
    for (const object of state.objects) {
      const key = object.parentId ?? 'root';
      if (!childrenByParent.has(key)) childrenByParent.set(key, []);
      childrenByParent.get(key).push(object);
    }
    const makeNode = (object, depth) => {
      const node = document.createElement('div');
      node.className = 'hierarchy-node';
      node.setAttribute('role', 'treeitem');
      node.setAttribute('aria-level', String(depth + 1));
      const row = document.createElement('div');
      row.className = 'hierarchy-row';
      row.style.setProperty('--depth', String(depth));
      const childObjects = childrenByParent.get(object.id) ?? [];
      const disclosure = document.createElement(childObjects.length ? 'button' : 'span');
      disclosure.className = 'disclosure';
      if (childObjects.length) {
        disclosure.type = 'button';
        disclosure.title = this.collapsedIds.has(object.id) ? '펼치기' : '접기';
        disclosure.setAttribute('aria-label', disclosure.title);
        disclosure.textContent = this.collapsedIds.has(object.id) ? '▸' : '▾';
        disclosure.addEventListener('click', () => {
          if (this.collapsedIds.has(object.id)) this.collapsedIds.delete(object.id);
          else this.collapsedIds.add(object.id);
          this.render();
        });
      }
      const select = document.createElement('button');
      select.type = 'button';
      select.className = 'hierarchy-select';
      if (state.selection.selectedIds.includes(object.id)) select.classList.add('selected');
      if (state.selection.activeId === object.id) select.classList.add('active');
      select.dataset.testid = `hierarchy-${object.id}`;
      select.textContent = `${object.type === 'group' ? '◇' : '◆'} ${object.name}`;
      select.title = object.name;
      select.addEventListener('click', (event) =>
        this.editorService.select(object.id, { additive: event.shiftKey }),
      );
      const visible = document.createElement('button');
      visible.type = 'button';
      visible.className = `state-button${object.visible ? '' : ' off'}`;
      visible.setAttribute('aria-label', `${object.name} 표시 전환`);
      visible.title = object.visible ? '숨기기' : '표시하기';
      visible.textContent = object.visible ? '◉' : '○';
      visible.addEventListener('click', () =>
        this.runAction(() => this.editorService.setVisible([object.id], !object.visible)),
      );
      const locked = document.createElement('button');
      locked.type = 'button';
      locked.className = `state-button${object.locked ? '' : ' off'}`;
      locked.setAttribute('aria-label', `${object.name} 잠금 전환`);
      locked.title = object.locked ? '잠금 해제' : '잠그기';
      locked.textContent = object.locked ? '▣' : '□';
      locked.addEventListener('click', () =>
        this.runAction(() => this.editorService.setLocked([object.id], !object.locked)),
      );
      row.append(disclosure, select, visible, locked);
      node.append(row);
      if (!this.collapsedIds.has(object.id)) {
        for (const child of childObjects) node.append(makeNode(child, depth + 1));
      }
      return node;
    };
    const roots = (childrenByParent.get('root') ?? []).filter((object) =>
      byObjectId.has(object.id),
    );
    container.replaceChildren(...roots.map((object) => makeNode(object, 0)));
    byId('hierarchy-empty').classList.toggle('hidden', state.objects.length > 0);
    byId('hierarchy-count').textContent = String(state.objects.length);
  }

  renderTransformValues(transform) {
    const setValues = (prefix, values, formatter = (value) => value) => {
      ['x', 'y', 'z'].forEach((axis, index) => {
        byId(`${prefix}-${axis}`).value = Number(formatter(values[index]).toFixed(4));
      });
    };
    setValues('position', transform.position);
    setValues('rotation', transform.rotation.radians, degrees);
    setValues('scale', transform.scale);
  }

  renderInspector(state) {
    const selected = state.selection.selectedIds
      .map((id) => state.objects.find((object) => object.id === id))
      .filter(Boolean);
    const form = byId('inspector-form');
    const empty = byId('inspector-empty');
    byId('selection-count').textContent = `${selected.length} selected`;
    empty.classList.toggle('hidden', selected.length > 0);
    form.classList.toggle('hidden', selected.length === 0);
    if (!selected.length) return;
    const active =
      selected.find((object) => object.id === state.selection.activeId) ?? selected.at(-1);
    const single = selected.length === 1;
    byId('object-name').value = single ? active.name : `${selected.length}개 선택`;
    byId('object-name').disabled = !single || !this.editorService.capability('rename').allowed;
    const transformAllowed = single && this.editorService.capability('transform').allowed;
    byId('transform-fieldset').disabled = !transformAllowed;
    if (single) this.renderTransformValues(active.transform);
    const materialAllowed =
      single && active.type === 'mesh' && this.editorService.capability('material').allowed;
    byId('material-fieldset').disabled = !materialAllowed;
    if (active.type === 'mesh') {
      byId('material-color').value = active.material.color;
      byId('material-roughness').value = String(active.material.roughness);
      byId('material-metalness').value = String(active.material.metalness);
      byId('material-opacity').value = String(active.material.opacity);
      byId('material-wireframe').checked = active.material.wireframe;
      byId('material-flat').checked = active.material.flatShading;
    }
    byId('object-visible').checked = active.visible;
    byId('object-locked').checked = active.locked;
    const inherited = effectiveState(state.objects, active.id);
    byId('inspector-note').textContent = !single
      ? '다중 선택에서는 Group, Delete, Duplicate, Lock, Hide만 사용할 수 있습니다.'
      : inherited.locked && !active.locked
        ? '부모 그룹에서 잠금이 상속되었습니다.'
        : !inherited.visible && active.visible
          ? '부모 그룹에서 숨김이 상속되었습니다.'
          : active.type === 'group'
            ? '그룹 Transform은 전체 subtree에 적용됩니다.'
            : `${active.geometry.kind} geometry`;
  }

  render() {
    const state = this.store.getState();
    this.renderHierarchy(state);
    this.renderInspector(state);
    const triangles = sceneTriangleCount(state.objects);
    for (const id of ['viewport-object-count', 'footer-object-count']) {
      byId(id).textContent = String(state.objects.length);
    }
    byId('triangle-count').textContent = triangles.toLocaleString();
    byId('empty-state').classList.toggle(
      'hidden',
      state.objects.length > 0 || !ThreeSceneAdapter.supportsWebGL2(),
    );
    const selectedNames = state.selection.selectedIds
      .map((id) => state.objects.find((object) => object.id === id)?.name)
      .filter(Boolean);
    byId('footer-selection').textContent =
      selectedNames.length === 0
        ? '없음'
        : selectedNames.length === 1
          ? selectedNames[0]
          : `${selectedNames.length}개`;
    byId('footer-tool').textContent = {
      select: 'Select',
      translate: 'Move',
      rotate: 'Rotate',
      scale: 'Scale',
    }[state.ui.activeTool];
    byId('status-message').textContent = this.statusText;
    const dirty = this.commandManager.isDirty;
    byId('dirty-state').textContent = dirty ? '● 저장 안 됨' : '저장됨';
    byId('dirty-state').classList.toggle('dirty', dirty);
    document.title = `${dirty ? '● ' : ''}${state.project.name} — Forge Studio`;
    for (const button of document.querySelectorAll('[data-tool]')) {
      button.classList.toggle('active', button.dataset.tool === state.ui.activeTool);
      button.setAttribute('aria-pressed', String(button.dataset.tool === state.ui.activeTool));
      if (button.dataset.tool !== 'select') {
        const capability = this.editorService.capability('transform');
        button.disabled = !capability.allowed;
        if (!capability.allowed) button.title = capability.reason;
      }
    }
    for (const button of document.querySelectorAll('[data-command]')) {
      const capability = this.editorService.capability(button.dataset.command);
      button.disabled = !capability.allowed;
      if (!capability.allowed && capability.reason) button.title = capability.reason;
    }
  }

  setStatus(message) {
    this.statusText = message;
    byId('status-message').textContent = message;
    this.render();
  }

  showError(error) {
    const appError =
      error instanceof AppError
        ? error
        : new AppError('UNEXPECTED_ERROR', '작업을 완료하지 못했습니다.', error?.message);
    byId('error-title').textContent = '복구 가능한 오류';
    byId('error-message').textContent = appError.userMessage;
    byId('error-code').textContent = appError.code;
    byId('error-toast').classList.remove('hidden');
    this.setStatus(appError.userMessage);
  }
}
