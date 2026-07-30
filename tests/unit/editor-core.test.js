import { describe, expect, it } from 'vitest';
import { CommandManager } from '../../src/commands/CommandManager.js';
import { createEmptyState, geometryDefaults } from '../../src/domain/model.js';
import { worldMatrix, worldTransformError } from '../../src/domain/sceneGraph.js';
import { EditorService } from '../../src/editor/EditorService.js';
import { EditorStore } from '../../src/state/EditorStore.js';
import { TemplateRegistry } from '../../src/templates/TemplateRegistry.js';

function idFactory() {
  let counter = 0;
  return () => {
    counter += 1;
    return `00000000-0000-4000-8000-${String(counter).padStart(12, '0')}`;
  };
}

function setup() {
  const store = new EditorStore(createEmptyState('2026-07-30T00:00:00.000Z'));
  const commandManager = new CommandManager(store, { maxEntries: 100 });
  commandManager.markSaved();
  const templateRegistry = new TemplateRegistry();
  const service = new EditorService({
    store,
    commandManager,
    templateRegistry,
    idFactory: idFactory(),
  });
  return { store, commandManager, service, templateRegistry };
}

describe('AT-001 Primitive 6종', () => {
  it('creates all primitives with defaults and shape-local names', () => {
    const { store, service } = setup();
    for (const kind of ['box', 'sphere', 'cylinder', 'cone', 'plane', 'torus']) {
      service.createPrimitive(kind);
    }
    expect(store.getState().objects).toHaveLength(6);
    expect(store.getState().objects.map((object) => object.name)).toEqual([
      'Cube',
      'Sphere',
      'Cylinder',
      'Cone',
      'Plane',
      'Torus',
    ]);
    for (const object of store.getState().objects) {
      expect(object.transform.position).toEqual([0, 0, 0]);
      expect(object.transform.rotation).toEqual({ order: 'XYZ', radians: [0, 0, 0] });
      expect(object.transform.scale).toEqual([1, 1, 1]);
      expect(object.visible).toBe(true);
      expect(object.locked).toBe(false);
      expect(object.geometry).toEqual(geometryDefaults(object.geometry.kind));
    }
    service.createPrimitive('box');
    expect(store.getState().objects.at(-1).name).toBe('Cube 2');
  });
});

describe('AT-003~005 selection and transform', () => {
  it('synchronizes single and shift-multi selection and limits commands', () => {
    const { store, service } = setup();
    const first = service.createPrimitive('box');
    const second = service.createPrimitive('sphere');
    service.select(first);
    service.select(second, { additive: true });
    expect(store.getState().selection.selectedIds).toEqual([first, second]);
    expect(store.getState().selection.activeId).toBe(second);
    expect(service.capability('group').allowed).toBe(true);
    expect(service.capability('delete').allowed).toBe(true);
    expect(service.capability('transform').allowed).toBe(false);
    expect(service.capability('material').allowed).toBe(false);
    service.select(second, { additive: true });
    expect(store.getState().selection.selectedIds).toEqual([first]);
  });

  it('round-trips valid transforms and rejects invalid numeric values atomically', () => {
    const { store, service, commandManager } = setup();
    const id = service.createPrimitive('box');
    const transform = {
      position: [1.25, 2.5, -3.75],
      rotation: { order: 'XYZ', radians: [Math.PI / 6, -Math.PI / 3, Math.PI / 2] },
      scale: [1.2, 0.8, 2.1],
    };
    service.updateTransform(id, transform);
    expect(store.getState().objects[0].transform).toEqual(transform);
    const revision = commandManager.currentRevision;
    expect(() => service.updateTransform(id, { ...transform, scale: [1, 0, 1] })).toThrow();
    expect(store.getState().objects[0].transform).toEqual(transform);
    expect(commandManager.currentRevision).toBe(revision);
  });
});

describe('AT-006~010 edit commands and hierarchy', () => {
  it('duplicates subtree IDs and remaps parent/template references', () => {
    const { store, service } = setup();
    const rootId = service.createTemplate('nature.oak');
    const source = store
      .getState()
      .objects.filter((object) => object.id === rootId || object.parentId === rootId);
    const duplicateRoots = service.duplicateSelection();
    const duplicateRoot = duplicateRoots[0];
    const duplicates = store
      .getState()
      .objects.filter((object) => object.id === duplicateRoot || object.parentId === duplicateRoot);
    expect(duplicates).toHaveLength(source.length);
    expect(new Set(duplicates.map((object) => object.id)).size).toBe(duplicates.length);
    expect(duplicates.every((object) => !source.some((entry) => entry.id === object.id))).toBe(
      true,
    );
    expect(
      duplicates
        .filter((object) => object.type === 'mesh')
        .every((object) => object.editor.templateRootId === duplicateRoot),
    ).toBe(true);
  });

  it('deletes and restores an entire subtree with one undo', () => {
    const { store, service } = setup();
    const rootId = service.createTemplate('prop.crate');
    const before = structuredClone(store.getState().objects);
    service.deleteSelection();
    expect(store.getState().objects).toHaveLength(0);
    expect(service.undo()).toBe(true);
    expect(store.getState().objects).toEqual(before);
    expect(store.getState().selection.selectedIds).toEqual([]);
    expect(rootId).toBeTruthy();
  });

  it('groups and ungroups while preserving world transforms within 1e-6', () => {
    const { store, service } = setup();
    const first = service.createPrimitive('box');
    service.updateTransform(first, {
      position: [1, 1, 0],
      rotation: { order: 'XYZ', radians: [0.2, 0.3, 0.1] },
      scale: [1.2, 0.8, 1.1],
    });
    const second = service.createPrimitive('sphere');
    service.updateTransform(second, {
      position: [-1, 0.5, 0.7],
      rotation: { order: 'XYZ', radians: [-0.1, 0.5, 0.2] },
      scale: [0.8, 1.1, 0.9],
    });
    service.select(first);
    service.select(second, { additive: true });
    const before = structuredClone(store.getState().objects);
    const groupId = service.groupSelection();
    const grouped = structuredClone(store.getState().objects);
    expect(worldTransformError(before, grouped, first)).toBeLessThanOrEqual(1e-6);
    expect(worldTransformError(before, grouped, second)).toBeLessThanOrEqual(1e-6);
    service.ungroupSelected();
    const ungrouped = store.getState().objects;
    expect(ungrouped.some((object) => object.id === groupId)).toBe(false);
    expect(worldTransformError(before, ungrouped, first)).toBeLessThanOrEqual(1e-6);
    expect(worldTransformError(before, ungrouped, second)).toBeLessThanOrEqual(1e-6);
  });

  it('rejects grouping across different parents', () => {
    const { store, service } = setup();
    const first = service.createPrimitive('box');
    const second = service.createPrimitive('sphere');
    service.select(first);
    service.select(second, { additive: true });
    const group = service.groupSelection();
    const third = service.createPrimitive('cone');
    service.select(first);
    service.select(third, { additive: true });
    expect(service.capability('group').allowed).toBe(false);
    expect(() => service.groupSelection()).toThrow();
    expect(store.getState().objects.find((object) => object.id === first).parentId).toBe(group);
  });

  it('inherits locked and hidden state and blocks destructive edits', () => {
    const { store, service } = setup();
    const root = service.createTemplate('nature.oak');
    const child = store.getState().objects.find((object) => object.parentId === root);
    service.setLocked([root], true);
    service.select(child.id);
    expect(service.capability('transform').allowed).toBe(false);
    expect(service.capability('delete').allowed).toBe(false);
    service.setLocked([root], false);
    service.setVisible([root], false);
    expect(service.capability('delete').allowed).toBe(false);
  });
});

describe('AT-011~012 history and dirty state', () => {
  it('keeps 100 entries, clears redo on branch, and returns to saved revision', () => {
    const { service, commandManager } = setup();
    for (let index = 0; index < 105; index += 1) service.createPrimitive('box');
    expect(commandManager.undoStack).toHaveLength(100);
    commandManager.markSaved();
    expect(commandManager.isDirty).toBe(false);
    service.createPrimitive('sphere');
    expect(commandManager.isDirty).toBe(true);
    service.undo();
    expect(commandManager.isDirty).toBe(false);
    service.redo();
    expect(commandManager.isDirty).toBe(true);
    service.undo();
    service.createPrimitive('cone');
    expect(commandManager.canRedo).toBe(false);
  });

  it('merges inspector-style updates within 500ms into one command', () => {
    const { service, commandManager } = setup();
    const id = service.createPrimitive('box');
    const beforeCount = commandManager.undoStack.length;
    const first = {
      position: [1, 0, 0],
      rotation: { order: 'XYZ', radians: [0, 0, 0] },
      scale: [1, 1, 1],
    };
    const second = { ...first, position: [2, 0, 0] };
    service.updateTransform(id, first, { merge: true });
    service.updateTransform(id, second, { merge: true });
    expect(commandManager.undoStack.length).toBe(beforeCount + 1);
    expect(worldMatrix(service.state.objects, id)[12]).toBeCloseTo(2);
    service.undo();
    expect(worldMatrix(service.state.objects, id)[12]).toBeCloseTo(0);
  });

  it('does not merge across an explicit saved revision', () => {
    const { service, commandManager } = setup();
    const id = service.createPrimitive('box');
    const first = {
      position: [1, 0, 0],
      rotation: { order: 'XYZ', radians: [0, 0, 0] },
      scale: [1, 1, 1],
    };
    service.updateTransform(id, first, { merge: true });
    commandManager.markSaved();
    const savedRevision = commandManager.savedRevision;
    service.updateTransform(id, { ...first, position: [2, 0, 0] }, { merge: true });
    expect(commandManager.currentRevision).not.toBe(savedRevision);
    service.undo();
    expect(worldMatrix(service.state.objects, id)[12]).toBeCloseTo(1);
    expect(commandManager.isDirty).toBe(false);
  });
});
