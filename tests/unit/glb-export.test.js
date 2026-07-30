import { readFile } from 'node:fs/promises';
import { validateBytes } from 'gltf-validator';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { beforeAll, describe, expect, it } from 'vitest';
import {
  createGroup,
  createMesh,
  defaultMaterial,
  defaultTransform,
} from '../../src/domain/model.js';
import { GLBExportService } from '../../src/io/GLBExportService.js';
import { migrateV05 } from '../../src/io/migrations/migrateV05.js';
import { TemplateRegistry } from '../../src/templates/TemplateRegistry.js';

class NodeFileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((result) => {
      this.result = result;
      this.onloadend?.({ target: this });
    });
  }

  readAsDataURL(blob) {
    blob.arrayBuffer().then((result) => {
      const base64 = Buffer.from(result).toString('base64');
      this.result = `data:${blob.type};base64,${base64}`;
      this.onloadend?.({ target: this });
    });
  }
}

function idFactory() {
  let counter = 0;
  return () => {
    counter += 1;
    return `50000000-0000-4000-8000-${String(counter).padStart(12, '0')}`;
  };
}

function loadGlb(arrayBuffer) {
  return new Promise((resolve, reject) => {
    new GLTFLoader().parse(arrayBuffer, '', resolve, reject);
  });
}

beforeAll(() => {
  globalThis.FileReader = NodeFileReader;
});

describe('AT-019 GLB filter, reload, axes, and icosahedron', () => {
  it('exports visible locked content, excludes a hidden subtree, and passes Khronos Validator', async () => {
    const visibleRoot = createGroup({
      id: '50000000-0000-4000-8000-000000000001',
      name: 'Visible Root',
      locked: true,
    });
    const visibleRock = createMesh({
      id: '50000000-0000-4000-8000-000000000002',
      name: 'Visible Rock',
      parentId: visibleRoot.id,
      geometry: { kind: 'icosahedron', parameters: { radius: 1.2, detail: 1 } },
      material: defaultMaterial('#747982', { flatShading: true }),
      transform: defaultTransform([0, 1.2, 2]),
    });
    const hiddenRoot = createGroup({
      id: '50000000-0000-4000-8000-000000000003',
      name: 'Hidden Root',
      visible: false,
    });
    const hiddenMesh = createMesh({
      id: '50000000-0000-4000-8000-000000000004',
      name: 'Hidden Mesh',
      parentId: hiddenRoot.id,
      geometry: {
        kind: 'box',
        parameters: {
          width: 1,
          height: 1,
          depth: 1,
          widthSegments: 1,
          heightSegments: 1,
          depthSegments: 1,
        },
      },
    });

    const buffer = await new GLBExportService().exportArrayBuffer([
      visibleRoot,
      visibleRock,
      hiddenRoot,
      hiddenMesh,
    ]);
    const report = await validateBytes(new Uint8Array(buffer), {
      uri: 'forge-studio-icosahedron.glb',
      format: 'glb',
      maxIssues: 0,
      writeTimestamp: false,
    });
    expect(report.issues.numErrors).toBe(0);
    expect(report.issues.numWarnings).toBe(0);

    const gltf = await loadGlb(buffer);
    expect(gltf.scene.up).toEqual(new THREE.Vector3(0, 1, 0));
    expect(gltf.scene.getObjectByName('Hidden_Root')).toBeUndefined();
    expect(gltf.scene.getObjectByName('Hidden_Mesh')).toBeUndefined();
    const rock = gltf.scene.getObjectByName('Visible_Rock');
    expect(rock).toBeDefined();
    expect(rock.position.toArray()).toEqual([0, 1.2, 2]);
    expect(rock.geometry.attributes.position.count).toBe(
      new THREE.IcosahedronGeometry(1.2, 1).attributes.position.count,
    );
    expect(rock.material.color.getHexString()).toBe('747982');
    expect(rock.userData.domainId).toBeUndefined();
    expect(rock.userData.locked).toBeUndefined();
    expect(rock.userData.editor).toBeUndefined();
  });

  it('round-trips the frozen v0.5 rock fixture through migration and GLB export', async () => {
    const legacy = JSON.parse(await readFile('tests/fixtures/v05/v05-rock.json', 'utf8'));
    const project = migrateV05(legacy, {
      now: '2026-07-30T00:00:00.000Z',
      idFactory: idFactory(),
    });
    const migrated = project.scene.objects[0];
    const buffer = await new GLBExportService().exportArrayBuffer(project.scene.objects);
    const gltf = await loadGlb(buffer);
    const rock = gltf.scene.getObjectByName('바위_원본');
    expect(rock).toBeDefined();
    expect(rock.position.toArray()).toEqual(migrated.transform.position);
    expect(rock.scale.toArray()).toEqual(migrated.transform.scale);
    rock.rotation
      .toArray()
      .slice(0, 3)
      .forEach((value, index) =>
        expect(value).toBeCloseTo(migrated.transform.rotation.radians[index], 12),
      );
    expect(rock.geometry.attributes.position.count).toBe(
      new THREE.IcosahedronGeometry(1.2, 1).attributes.position.count,
    );
    rock.geometry.computeBoundingSphere();
    expect(rock.geometry.boundingSphere.radius).toBeCloseTo(1.2, 5);
  });

  it('reloads all 20 templates with their Root/Part hierarchy and PBR materials', async () => {
    const registry = new TemplateRegistry();
    for (const definition of registry.list()) {
      const built = registry.build(definition.templateId, { idFactory: idFactory() });
      const buffer = await new GLBExportService().exportArrayBuffer(built.objects);
      const gltf = await loadGlb(buffer);
      const meshes = [];
      gltf.scene.traverse((object) => {
        if (object.isMesh) meshes.push(object);
      });
      expect(meshes, definition.templateId).toHaveLength(definition.parts.length);
      expect(
        meshes.every((mesh) => mesh.material?.isMeshStandardMaterial),
        definition.templateId,
      ).toBe(true);
      const root = gltf.scene.children.find((object) => object.name !== 'ForgeStudioExport');
      expect(root, definition.templateId).toBeDefined();
      expect(root.children, definition.templateId).toHaveLength(definition.parts.length);
    }
  });
});
