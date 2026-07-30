import {
  APP_VERSION,
  createGroup,
  createId,
  createMesh,
  defaultMaterial,
} from '../../domain/model.js';
import { AppError } from '../AppError.js';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;

function finiteNumber(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
}

function vector(value, fallback) {
  return Array.isArray(value) && value.length === 3
    ? value.map((entry, index) => finiteNumber(entry, fallback[index]))
    : [...fallback];
}

function colorToHex(value) {
  if (typeof value === 'string' && /^#[0-9a-f]{6}$/iu.test(value)) return value.toUpperCase();
  const numeric = Number.isInteger(value) ? Math.max(0, Math.min(0xffffff, value)) : 0x1f8efa;
  return `#${numeric.toString(16).padStart(6, '0').toUpperCase()}`;
}

function geometryFromLegacy(object) {
  const type = object.type;
  switch (type) {
    case 'box':
      return {
        kind: 'box',
        parameters: {
          width: 2,
          height: 2,
          depth: 2,
          widthSegments: 1,
          heightSegments: 1,
          depthSegments: 1,
        },
      };
    case 'sphere':
      return {
        kind: 'sphere',
        parameters: { radius: 1.1, widthSegments: 24, heightSegments: 16 },
      };
    case 'cylinder':
      return {
        kind: 'cylinder',
        parameters: {
          radiusTop: 1,
          radiusBottom: 1,
          height: 2.2,
          radialSegments: 24,
          heightSegments: 1,
          openEnded: false,
        },
      };
    case 'cone':
      return {
        kind: 'cone',
        parameters: {
          radius: 1.1,
          height: 2.4,
          radialSegments: 24,
          heightSegments: 1,
          openEnded: false,
        },
      };
    case 'plane':
      return {
        kind: 'box',
        parameters: {
          width: 3,
          height: 0.12,
          depth: 3,
          widthSegments: 1,
          heightSegments: 1,
          depthSegments: 1,
        },
      };
    case 'torus':
      return {
        kind: 'torus',
        parameters: {
          radius: 1.05,
          tube: 0.34,
          radialSegments: 16,
          tubularSegments: 36,
          arc: Math.PI * 2,
        },
      };
    case 'rock':
      return {
        kind: 'icosahedron',
        parameters: {
          radius: finiteNumber(object.geometry?.radius ?? object.radius, 1.2),
          detail: Number.isInteger(object.geometry?.detail ?? object.detail)
            ? Math.max(0, object.geometry?.detail ?? object.detail)
            : 1,
        },
      };
    default:
      throw new AppError(
        'PROJECT_MIGRATION_FAILED',
        '지원하지 않는 v0.5 오브젝트가 있습니다.',
        `Unsupported v0.5 type: ${String(type)}`,
      );
  }
}

export function migrateV05(
  legacy,
  {
    idFactory = createId,
    now = new Date().toISOString(),
    projectName = 'Migrated v0.5 Project',
  } = {},
) {
  if (!legacy || typeof legacy !== 'object' || !Array.isArray(legacy.objects)) {
    throw new AppError('PROJECT_MIGRATION_FAILED', 'v0.5 프로젝트 형식을 확인할 수 없습니다.');
  }
  const idByLegacyId = new Map();
  const allocatedIds = legacy.objects.map((object, index) => {
    const legacyId = typeof object.id === 'string' ? object.id : `legacy-${index}`;
    const id = UUID_PATTERN.test(legacyId) ? legacyId : idFactory();
    idByLegacyId.set(legacyId, id);
    return id;
  });
  const objects = legacy.objects.map((object, index) => {
    const id = allocatedIds[index];
    const legacyParentKey =
      object.parentId === null || object.parentId === undefined ? null : String(object.parentId);
    const parentId = legacyParentKey === null ? null : idByLegacyId.get(legacyParentKey);
    if (legacyParentKey !== null && !parentId) {
      throw new AppError(
        'PROJECT_MIGRATION_FAILED',
        'v0.5 계층 참조를 복원할 수 없습니다.',
        `Missing legacy parent: ${legacyParentKey}`,
      );
    }
    const transform = {
      position: vector(object.position, [0, object.type === 'plane' ? 0.06 : 1.1, 0]),
      rotation: {
        order: 'XYZ',
        radians: vector(object.rotation, [0, 0, 0]),
      },
      scale: vector(object.scale, [1, 1, 1]).map((value) => (value > 0 ? value : 1)),
    };
    if (object.type === 'group') {
      return createGroup({
        id,
        name: object.name || `Group ${index + 1}`,
        parentId,
        transform,
        visible: object.visible ?? true,
        locked: object.locked ?? false,
      });
    }
    const opacity = finiteNumber(object.opacity, 1);
    return createMesh({
      id,
      name: object.name || `Object ${index + 1}`,
      parentId,
      transform,
      visible: object.visible ?? true,
      locked: object.locked ?? false,
      geometry: geometryFromLegacy(object),
      material: defaultMaterial(colorToHex(object.color), {
        roughness: finiteNumber(object.roughness, 0.55),
        metalness: finiteNumber(object.metalness, 0.05),
        opacity,
        transparent: object.transparent ?? opacity < 1,
        wireframe: object.wireframe ?? false,
        flatShading: object.flatShading ?? false,
        side: object.side ?? 'front',
      }),
    });
  });
  return {
    schemaVersion: 2,
    appVersion: APP_VERSION,
    project: { name: projectName, createdAt: now, updatedAt: now },
    settings: {
      units: 'meter',
      upAxis: 'Y',
      assetFront: '+Z',
      gridSize: 1,
      backgroundColor: '#1B1D22',
    },
    scene: { objects },
  };
}
