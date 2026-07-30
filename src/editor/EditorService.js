import {
  createEmptyState,
  createGroup,
  createId,
  createMesh,
  defaultMaterial,
  defaultTransform,
  geometryDefaults,
  nextObjectName,
  structuredCloneSafe,
  validateName,
} from '../domain/model.js';
import {
  composeMatrix,
  decomposeMatrix,
  identityMatrix,
  invertMatrix,
  matrixMaxError,
  multiplyMatrices,
  transformPoint,
} from '../domain/math.js';
import {
  effectiveState,
  normalizeTopLevelSelection,
  objectMap,
  subtreeIds,
  worldBoundsForIds,
  worldMatrix,
} from '../domain/sceneGraph.js';
import { AppError } from '../io/AppError.js';

const PRIMITIVE_NAMES = {
  box: 'Cube',
  sphere: 'Sphere',
  cylinder: 'Cylinder',
  cone: 'Cone',
  plane: 'Plane',
  torus: 'Torus',
  icosahedron: 'Icosahedron',
};
const MULTI_COMMANDS = new Set(['group', 'delete', 'duplicate', 'lock', 'hide']);

function commandError(message, technicalMessage = message) {
  return new AppError('COMMAND_NOT_ALLOWED', message, technicalMessage);
}

function assertTransform(transform) {
  const numbers = [...transform.position, ...transform.rotation.radians, ...transform.scale];
  if (!numbers.every(Number.isFinite)) throw commandError('유한한 숫자만 입력할 수 있습니다.');
  if (transform.rotation.order !== 'XYZ') throw commandError('Rotation order는 XYZ여야 합니다.');
  if (transform.position.some((value) => Math.abs(value) > 1_000_000)) {
    throw commandError('Position 범위를 벗어났습니다.');
  }
  if (transform.rotation.radians.some((value) => Math.abs(value) > 1_000_000)) {
    throw commandError('Rotation 범위를 벗어났습니다.');
  }
  if (transform.scale.some((value) => value <= 0.000001 || value > 10_000)) {
    throw commandError('Scale은 0보다 크고 10,000 이하여야 합니다.');
  }
}

function cloneWithSelection(state, objects, selectedIds, activeId = selectedIds.at(-1) ?? null) {
  return {
    ...state,
    objects,
    selection: { selectedIds, activeId },
  };
}

export class EditorService {
  constructor({ store, commandManager, templateRegistry, idFactory = createId }) {
    this.store = store;
    this.commandManager = commandManager;
    this.templateRegistry = templateRegistry;
    this.idFactory = idFactory;
  }

  get state() {
    return this.store.getState();
  }

  newProject({ now = new Date().toISOString() } = {}) {
    this.store.setState(createEmptyState(now), 'project:new');
    this.commandManager.clear({ markSaved: true });
  }

  replaceProject(state) {
    this.store.setState(state, 'project:open');
    this.commandManager.clear({ markSaved: true });
  }

  select(id, { additive = false } = {}) {
    const state = this.state;
    if (!id) {
      this.store.setState(
        { ...state, selection: { selectedIds: [], activeId: null } },
        'selection',
      );
      return;
    }
    if (!state.objects.some((object) => object.id === id)) return;
    let selectedIds;
    if (!additive) selectedIds = [id];
    else if (state.selection.selectedIds.includes(id)) {
      selectedIds = state.selection.selectedIds.filter((selectedId) => selectedId !== id);
    } else {
      selectedIds = [...state.selection.selectedIds, id];
    }
    this.store.setState(
      {
        ...state,
        selection: {
          selectedIds,
          activeId: selectedIds.includes(id) ? id : (selectedIds.at(-1) ?? null),
        },
      },
      'selection',
    );
  }

  setTool(activeTool) {
    if (!['select', 'translate', 'rotate', 'scale'].includes(activeTool)) return;
    this.store.setState({ ...this.state, ui: { ...this.state.ui, activeTool } }, 'tool');
  }

  capability(command) {
    const { objects, selection } = this.state;
    const ids = normalizeTopLevelSelection(objects, selection.selectedIds);
    if (command === 'undo') return { allowed: this.commandManager.canUndo, reason: '' };
    if (command === 'redo') return { allowed: this.commandManager.canRedo, reason: '' };
    if (!ids.length) return { allowed: false, reason: '먼저 오브젝트를 선택하세요.' };
    if (ids.length > 1 && !MULTI_COMMANDS.has(command)) {
      return {
        allowed: false,
        reason: '다중 선택에서는 Group, Delete, Duplicate, Lock, Hide만 사용할 수 있습니다.',
      };
    }
    const states = ids.map((id) => effectiveState(objects, id));
    if (
      ['transform', 'delete', 'ground', 'ungroup', 'rename', 'material'].includes(command) &&
      states.some((entry) => entry.locked || !entry.visible)
    ) {
      return {
        allowed: false,
        reason: '잠금 또는 숨김 오브젝트에는 이 명령을 사용할 수 없습니다.',
      };
    }
    if (command === 'group') {
      if (ids.length < 2) return { allowed: false, reason: '두 개 이상 선택하세요.' };
      const byId = objectMap(objects);
      const parents = new Set(ids.map((id) => byId.get(id).parentId));
      if (parents.size !== 1)
        return { allowed: false, reason: '같은 부모의 오브젝트만 그룹화할 수 있습니다.' };
    }
    if (command === 'ungroup') {
      const object = objectMap(objects).get(ids[0]);
      if (object?.type !== 'group') return { allowed: false, reason: '그룹을 선택하세요.' };
    }
    return { allowed: true, reason: '' };
  }

  #assertCapability(command) {
    const capability = this.capability(command);
    if (!capability.allowed) throw commandError(capability.reason);
  }

  createPrimitive(kind) {
    const state = this.state;
    const geometry = geometryDefaults(kind);
    const name = nextObjectName(state.objects, PRIMITIVE_NAMES[kind]);
    const object = createMesh({
      id: this.idFactory(),
      name,
      geometry,
      material: defaultMaterial(),
      transform: defaultTransform([0, 0, 0]),
    });
    this.commandManager.executeState(`Create ${name}`, (draft) => {
      draft.objects.push(object);
      draft.selection = { selectedIds: [object.id], activeId: object.id };
      return draft;
    });
    return object.id;
  }

  createTemplate(templateId) {
    const built = this.templateRegistry.build(templateId, { idFactory: this.idFactory });
    this.commandManager.executeState(`Create ${built.definition.name}`, (draft) => {
      draft.objects.push(...built.objects);
      draft.selection = { selectedIds: [built.rootId], activeId: built.rootId };
      return draft;
    });
    return built.rootId;
  }

  renameSelected(name) {
    this.#assertCapability('rename');
    if (!validateName(name)) throw commandError('이름은 1–120자의 일반 텍스트여야 합니다.');
    const id = this.state.selection.activeId;
    this.commandManager.executeState(
      'Rename object',
      (draft) => {
        const object = draft.objects.find((entry) => entry.id === id);
        object.name = name;
      },
      { mergeKey: `name:${id}` },
    );
  }

  updateTransform(id, transform, { merge = false } = {}) {
    this.#assertCapability('transform');
    assertTransform(transform);
    this.commandManager.executeState(
      'Transform object',
      (draft) => {
        const object = draft.objects.find((entry) => entry.id === id);
        if (!object) throw commandError('선택한 오브젝트를 찾을 수 없습니다.');
        object.transform = structuredCloneSafe(transform);
      },
      merge ? { mergeKey: `transform:${id}` } : undefined,
    );
  }

  updateMaterial(id, patch, { merge = false } = {}) {
    this.#assertCapability('material');
    this.commandManager.executeState(
      'Update material',
      (draft) => {
        const object = draft.objects.find((entry) => entry.id === id);
        if (object?.type !== 'mesh') throw commandError('Mesh 재질만 편집할 수 있습니다.');
        const next = { ...object.material, ...patch };
        if (
          !/^#[0-9a-f]{6}$/iu.test(next.color) ||
          ![next.roughness, next.metalness, next.opacity].every(Number.isFinite) ||
          next.roughness < 0 ||
          next.roughness > 1 ||
          next.metalness < 0 ||
          next.metalness > 1 ||
          next.opacity <= 0 ||
          next.opacity > 1
        ) {
          throw commandError('재질 값이 허용 범위를 벗어났습니다.');
        }
        next.transparent = next.opacity < 1 || Boolean(next.transparent);
        object.material = next;
      },
      merge ? { mergeKey: `material:${id}` } : undefined,
    );
  }

  setVisible(ids, visible) {
    this.commandManager.executeState('Set visibility', (draft) => {
      for (const object of draft.objects) {
        if (ids.includes(object.id)) object.visible = visible;
      }
    });
  }

  setLocked(ids, locked) {
    this.commandManager.executeState('Set locked', (draft) => {
      for (const object of draft.objects) {
        if (ids.includes(object.id)) object.locked = locked;
      }
    });
  }

  toggleSelectedVisibility() {
    this.#assertCapability('hide');
    const ids = normalizeTopLevelSelection(this.state.objects, this.state.selection.selectedIds);
    const byId = objectMap(this.state.objects);
    const hide = ids.some((id) => byId.get(id).visible);
    this.setVisible(ids, !hide);
  }

  toggleSelectedLocked() {
    this.#assertCapability('lock');
    const ids = normalizeTopLevelSelection(this.state.objects, this.state.selection.selectedIds);
    const byId = objectMap(this.state.objects);
    const lock = ids.some((id) => !byId.get(id).locked);
    this.setLocked(ids, lock);
  }

  duplicateSelection() {
    this.#assertCapability('duplicate');
    const { objects, selection } = this.state;
    const ids = normalizeTopLevelSelection(objects, selection.selectedIds);
    const sourceById = objectMap(objects);
    const cloneIds = new Map();
    const allSourceIds = ids.flatMap((id) => subtreeIds(objects, id));
    for (const sourceId of allSourceIds) cloneIds.set(sourceId, this.idFactory());
    const clones = [];
    for (const sourceId of allSourceIds) {
      const source = sourceById.get(sourceId);
      const clone = structuredCloneSafe(source);
      clone.id = cloneIds.get(sourceId);
      clone.parentId = cloneIds.get(source.parentId) ?? source.parentId;
      if (ids.includes(sourceId)) {
        clone.name = nextObjectName([...objects, ...clones], `${source.name} Copy`);
        clone.transform.position = clone.transform.position.map(
          (value, axis) => value + [0.5, 0.2, 0.5][axis],
        );
      }
      if (clone.editor?.templateRootId && cloneIds.has(clone.editor.templateRootId)) {
        clone.editor.templateRootId = cloneIds.get(clone.editor.templateRootId);
      }
      clones.push(clone);
    }
    const selectedIds = ids.map((id) => cloneIds.get(id));
    this.commandManager.executeState('Duplicate selection', (draft) =>
      cloneWithSelection(draft, [...draft.objects, ...clones], selectedIds, selectedIds.at(-1)),
    );
    return selectedIds;
  }

  deleteSelection() {
    this.#assertCapability('delete');
    const { objects, selection } = this.state;
    const ids = normalizeTopLevelSelection(objects, selection.selectedIds);
    const removeIds = new Set(ids.flatMap((id) => subtreeIds(objects, id)));
    this.commandManager.executeState('Delete selection', (draft) =>
      cloneWithSelection(
        draft,
        draft.objects.filter((object) => !removeIds.has(object.id)),
        [],
        null,
      ),
    );
  }

  groupSelection() {
    this.#assertCapability('group');
    const { objects, selection } = this.state;
    const ids = normalizeTopLevelSelection(objects, selection.selectedIds);
    if (
      ids.some((id) => {
        const state = effectiveState(objects, id);
        return state.locked || !state.visible;
      })
    ) {
      throw commandError('잠금 또는 숨김 오브젝트는 그룹화할 수 없습니다.');
    }
    const byId = objectMap(objects);
    const parentId = byId.get(ids[0]).parentId;
    const bounds = worldBoundsForIds(objects, ids);
    const center = bounds.min.map((value, axis) => (value + bounds.max[axis]) / 2);
    const parentWorld = parentId ? worldMatrix(objects, parentId) : identityMatrix();
    const localCenter = transformPoint(invertMatrix(parentWorld), center);
    const groupId = this.idFactory();
    const group = createGroup({
      id: groupId,
      name: nextObjectName(objects, 'Group'),
      parentId,
      transform: defaultTransform(localCenter),
    });
    const groupWorld = multiplyMatrices(parentWorld, composeMatrix(group.transform));
    const inverseGroupWorld = invertMatrix(groupWorld);
    const updatedObjects = objects.map((object) => {
      if (!ids.includes(object.id)) return structuredCloneSafe(object);
      const localMatrix = multiplyMatrices(inverseGroupWorld, worldMatrix(objects, object.id));
      const transform = decomposeMatrix(localMatrix);
      if (matrixMaxError(localMatrix, composeMatrix(transform)) > 1e-6) {
        throw commandError('Group 변환에서 world transform을 보존할 수 없습니다.');
      }
      return { ...structuredCloneSafe(object), parentId: groupId, transform };
    });
    this.commandManager.executeState('Group selection', (draft) =>
      cloneWithSelection(draft, [...updatedObjects, group], [groupId], groupId),
    );
    return groupId;
  }

  ungroupSelected() {
    this.#assertCapability('ungroup');
    const { objects, selection } = this.state;
    const groupId = selection.activeId;
    const byId = objectMap(objects);
    const group = byId.get(groupId);
    const parentWorld = group.parentId ? worldMatrix(objects, group.parentId) : identityMatrix();
    const inverseParentWorld = invertMatrix(parentWorld);
    const childIds = objects
      .filter((object) => object.parentId === groupId)
      .map((object) => object.id);
    const updated = objects
      .filter((object) => object.id !== groupId)
      .map((object) => {
        if (!childIds.includes(object.id)) return structuredCloneSafe(object);
        const localMatrix = multiplyMatrices(inverseParentWorld, worldMatrix(objects, object.id));
        const transform = decomposeMatrix(localMatrix);
        if (matrixMaxError(localMatrix, composeMatrix(transform)) > 1e-6) {
          throw commandError('Ungroup 변환에서 world transform을 보존할 수 없습니다.');
        }
        return {
          ...structuredCloneSafe(object),
          parentId: group.parentId,
          transform,
          editor:
            group.editor?.templateRole === 'root'
              ? { templateRole: 'none' }
              : structuredCloneSafe(object.editor),
        };
      });
    this.commandManager.executeState('Ungroup', (draft) =>
      cloneWithSelection(draft, updated, childIds, childIds.at(-1)),
    );
  }

  groundAlignSelected() {
    this.#assertCapability('ground');
    const { objects, selection } = this.state;
    const id = selection.activeId;
    const object = objectMap(objects).get(id);
    const bounds = worldBoundsForIds(objects, [id]);
    const world = worldMatrix(objects, id);
    const movedWorld = [...world];
    movedWorld[13] -= bounds.min[1];
    const parentWorld = object.parentId ? worldMatrix(objects, object.parentId) : identityMatrix();
    const local = multiplyMatrices(invertMatrix(parentWorld), movedWorld);
    const transform = decomposeMatrix(local);
    if (matrixMaxError(local, composeMatrix(transform)) > 1e-6) {
      throw commandError('Ground Align에서 world transform을 보존할 수 없습니다.');
    }
    this.updateTransform(id, transform);
  }

  undo() {
    return this.commandManager.undo();
  }

  redo() {
    return this.commandManager.redo();
  }
}
