import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import {
  createEmptyState,
  createGroup,
  createMesh,
  defaultMaterial,
  defaultTransform,
  geometryDefaults,
} from '../../src/domain/model.js';
import { parseProjectText } from '../../src/io/ProjectLoader.js';
import { projectFromState, stateFromProject } from '../../src/io/ProjectSerializer.js';
import { validateProject } from '../../src/io/ProjectValidator.js';
import { migrateV05 } from '../../src/io/migrations/migrateV05.js';
import { createGeometry } from '../../src/scene/ObjectViewFactory.js';

function idFactory() {
  let counter = 0;
  return () => {
    counter += 1;
    return `20000000-0000-4000-8000-${String(counter).padStart(12, '0')}`;
  };
}

const now = '2026-07-30T00:00:00.000Z';

describe('AT-013 Schema v2 round-trip', () => {
  it('round-trips schema data without UI/history state', () => {
    const state = createEmptyState(now);
    state.project.name = 'Round Trip';
    state.objects.push(
      createMesh({
        id: idFactory()(),
        name: 'Rock',
        geometry: { kind: 'icosahedron', parameters: { radius: 1.2, detail: 1 } },
        material: defaultMaterial('#747982', { flatShading: true }),
        transform: defaultTransform([1, 2, 3]),
      }),
    );
    state.selection = { selectedIds: [state.objects[0].id], activeId: state.objects[0].id };
    const project = projectFromState(state, { now });
    expect(validateProject(project)).toEqual({ valid: true, errors: [] });
    const restored = stateFromProject(JSON.parse(JSON.stringify(project)));
    expect(restored.objects).toEqual(state.objects);
    expect(restored.selection).toEqual({ selectedIds: [], activeId: null });
  });
});

describe('AT-014 v0.5 migration and icosahedron preservation', () => {
  it('migrates the frozen v0.5 oak fixture', async () => {
    const text = await readFile('tests/fixtures/v05/v05-oak.json', 'utf8');
    const result = parseProjectText(text, {
      filename: 'v05-oak.json',
      now,
      idFactory: idFactory(),
    });
    expect(result.migrated).toBe(true);
    expect(result.project.scene.objects).toHaveLength(5);
    expect(validateProject(result.project).valid).toBe(true);
    expect(result.project.scene.objects[0].geometry.kind).toBe('cylinder');
  });

  it('maps legacy rock to an exact IcosahedronGeometry with preserved data', () => {
    const legacy = {
      version: 2,
      objects: [
        {
          type: 'rock',
          name: '바위 원본',
          color: 0x747982,
          roughness: 1,
          metalness: 0.12,
          flatShading: true,
          position: [1, 2, 3],
          rotation: [0.1, 0.2, 0.3],
          scale: [1.2, 0.8, 0.9],
          radius: 1.2,
          detail: 1,
        },
      ],
    };
    const project = migrateV05(legacy, { now, idFactory: idFactory() });
    const migrated = project.scene.objects[0];
    expect(migrated.geometry).toEqual({
      kind: 'icosahedron',
      parameters: { radius: 1.2, detail: 1 },
    });
    expect(migrated.name).toBe('바위 원본');
    expect(migrated.transform.position).toEqual([1, 2, 3]);
    expect(migrated.transform.rotation.radians).toEqual([0.1, 0.2, 0.3]);
    expect(migrated.transform.scale).toEqual([1.2, 0.8, 0.9]);
    expect(migrated.material.color).toBe('#747982');
    expect(migrated.material.flatShading).toBe(true);
    const expected = createGeometry({
      kind: 'icosahedron',
      parameters: { radius: 1.2, detail: 1 },
    });
    const actual = createGeometry(migrated.geometry);
    expect([...actual.attributes.position.array]).toEqual([...expected.attributes.position.array]);
    expect(actual.getIndex()?.array ?? null).toEqual(expected.getIndex()?.array ?? null);
  });

  it('uses Three.js legacy defaults when rock fields are missing', () => {
    const project = migrateV05(
      { version: 2, objects: [{ type: 'rock', name: 'Rock' }] },
      { now, idFactory: idFactory() },
    );
    expect(project.scene.objects[0].geometry.parameters).toEqual({ radius: 1.2, detail: 1 });
  });

  it('preserves rock name, hierarchy, transform, material, color, and flat shading', () => {
    const legacy = {
      version: 2,
      objects: [
        {
          id: 'legacy-group',
          type: 'group',
          name: '바위 그룹',
          position: [4, 0, -2],
          rotation: [0.2, 0, -0.1],
          scale: [1.1, 1.2, 0.9],
        },
        {
          id: 'legacy-rock',
          parentId: 'legacy-group',
          type: 'rock',
          name: '계층 바위',
          color: 0x445566,
          roughness: 0.8,
          metalness: 0.2,
          flatShading: true,
          position: [1, 2, 3],
          rotation: [0.1, 0.3, 0.5],
          scale: [0.7, 0.8, 0.9],
        },
      ],
    };
    const project = migrateV05(legacy, { now, idFactory: idFactory() });
    const [group, rock] = project.scene.objects;
    expect(rock.parentId).toBe(group.id);
    expect(rock.name).toBe('계층 바위');
    expect(rock.transform).toEqual({
      position: [1, 2, 3],
      rotation: { order: 'XYZ', radians: [0.1, 0.3, 0.5] },
      scale: [0.7, 0.8, 0.9],
    });
    expect(rock.material).toMatchObject({
      color: '#445566',
      roughness: 0.8,
      metalness: 0.2,
      flatShading: true,
    });
    expect(group.transform).toEqual({
      position: [4, 0, -2],
      rotation: { order: 'XYZ', radians: [0.2, 0, -0.1] },
      scale: [1.1, 1.2, 0.9],
    });
  });
});

describe('AT-015~017 invalid and hostile project inputs', () => {
  it('rejects malformed JSON, upper schema versions, and >20MB input', () => {
    expect(() => parseProjectText('{', { filename: 'bad.forge.json' })).toThrow();
    expect(() =>
      parseProjectText('{"schemaVersion":3}', { filename: 'future.forge.json' }),
    ).toThrow(/Schema v3/u);
    expect(() =>
      parseProjectText(`{"padding":"${'x'.repeat(20 * 1024 * 1024)}"}`, {
        filename: 'large.forge.json',
      }),
    ).toThrow(/20MB/u);
  });

  it('rejects duplicate IDs, missing parents, cycles, and dangerous keys', () => {
    const root = createGroup({
      id: '30000000-0000-4000-8000-000000000001',
      name: 'Root',
    });
    const child = createMesh({
      id: '30000000-0000-4000-8000-000000000002',
      name: 'Child',
      parentId: root.id,
      geometry: geometryDefaults('box'),
    });
    const state = createEmptyState(now);
    state.objects = [root, child];
    const valid = projectFromState(state, { now });
    expect(validateProject(valid).valid).toBe(true);
    const duplicate = structuredClone(valid);
    duplicate.scene.objects.push(structuredClone(child));
    expect(validateProject(duplicate).valid).toBe(false);
    const missing = structuredClone(valid);
    missing.scene.objects[1].parentId = '30000000-0000-4000-8000-999999999999';
    expect(validateProject(missing).valid).toBe(false);
    const cycle = structuredClone(valid);
    cycle.scene.objects[0].parentId = child.id;
    expect(validateProject(cycle).valid).toBe(false);
    const hostile = JSON.parse(
      JSON.stringify(valid).replace('"project":', '"__proto__":{"polluted":true},"project":'),
    );
    expect(validateProject(hostile).valid).toBe(false);
  });

  it('rejects malformed UUIDs, hierarchy depth over 64, and more than 5,000 objects', () => {
    const invalidUuid = projectFromState(createEmptyState(now), { now });
    invalidUuid.scene.objects.push(
      createGroup({
        id: 'not-a-uuid',
        name: 'Invalid UUID',
      }),
    );
    expect(validateProject(invalidUuid).valid).toBe(false);

    const deep = projectFromState(createEmptyState(now), { now });
    for (let index = 0; index < 66; index += 1) {
      const id = `70000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`;
      deep.scene.objects.push(
        createGroup({
          id,
          name: `Depth ${index}`,
          parentId: index ? `70000000-0000-4000-8000-${String(index).padStart(12, '0')}` : null,
        }),
      );
    }
    expect(validateProject(deep).valid).toBe(false);

    const oversized = projectFromState(createEmptyState(now), { now });
    for (let index = 0; index < 5001; index += 1) {
      oversized.scene.objects.push(
        createGroup({
          id: `71000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`,
          name: `Object ${index}`,
        }),
      );
    }
    expect(validateProject(oversized).valid).toBe(false);
  });

  it('enforces positive finite icosahedron radius and non-negative integer detail', () => {
    const state = createEmptyState(now);
    state.objects.push(
      createMesh({
        id: '40000000-0000-4000-8000-000000000001',
        name: 'Ico',
        geometry: { kind: 'icosahedron', parameters: { radius: 1, detail: 0 } },
      }),
    );
    const project = projectFromState(state, { now });
    expect(validateProject(project).valid).toBe(true);
    for (const radius of [0, -1, Number.NaN, Number.POSITIVE_INFINITY]) {
      const invalid = structuredClone(project);
      invalid.scene.objects[0].geometry.parameters.radius = radius;
      expect(validateProject(invalid).valid).toBe(false);
    }
    for (const detail of [-1, 1.2, 6]) {
      const invalid = structuredClone(project);
      invalid.scene.objects[0].geometry.parameters.detail = detail;
      expect(validateProject(invalid).valid).toBe(false);
    }
    for (const field of ['radius', 'detail']) {
      const invalid = structuredClone(project);
      delete invalid.scene.objects[0].geometry.parameters[field];
      expect(validateProject(invalid).valid).toBe(false);
    }
  });
});
