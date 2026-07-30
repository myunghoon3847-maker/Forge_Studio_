export const APP_VERSION = '0.6.0-alpha';
export const SCHEMA_VERSION = 2;
export const MAX_OBJECTS = 5000;
export const MAX_DEPTH = 64;

const CONTROL_CHARACTERS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u;

export function createId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  const bytes = new Uint8Array(16);
  globalThis.crypto?.getRandomValues?.(bytes);
  if (!bytes.some(Boolean)) {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((value) => value.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(
    16,
    20,
  )}-${hex.slice(20)}`;
}

export function validateName(value) {
  if (typeof value !== 'string') return false;
  if (value.length < 1 || value.length > 120 || !value.trim()) return false;
  return !CONTROL_CHARACTERS.test(value);
}

export function assertName(value) {
  if (!validateName(value)) {
    throw new Error('Name must be 1–120 visible Unicode characters without controls.');
  }
  return value;
}

export function defaultTransform(position = [0, 0, 0]) {
  return {
    position: [...position],
    rotation: { order: 'XYZ', radians: [0, 0, 0] },
    scale: [1, 1, 1],
  };
}

export function defaultMaterial(color = '#1F8EFA', overrides = {}) {
  const opacity = overrides.opacity ?? 1;
  return {
    type: 'meshStandard',
    color,
    roughness: overrides.roughness ?? 0.55,
    metalness: overrides.metalness ?? 0.05,
    opacity,
    transparent: opacity < 1 || Boolean(overrides.transparent),
    wireframe: Boolean(overrides.wireframe),
    flatShading: Boolean(overrides.flatShading),
    side: overrides.side ?? 'front',
  };
}

export const GEOMETRY_DEFAULTS = Object.freeze({
  box: {
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
  sphere: {
    kind: 'sphere',
    parameters: { radius: 0.5, widthSegments: 16, heightSegments: 10 },
  },
  cylinder: {
    kind: 'cylinder',
    parameters: {
      radiusTop: 0.5,
      radiusBottom: 0.5,
      height: 1,
      radialSegments: 12,
      heightSegments: 1,
      openEnded: false,
    },
  },
  cone: {
    kind: 'cone',
    parameters: {
      radius: 0.5,
      height: 1,
      radialSegments: 12,
      heightSegments: 1,
      openEnded: false,
    },
  },
  plane: {
    kind: 'plane',
    parameters: { width: 1, height: 1, widthSegments: 1, heightSegments: 1 },
  },
  torus: {
    kind: 'torus',
    parameters: {
      radius: 0.5,
      tube: 0.15,
      radialSegments: 8,
      tubularSegments: 16,
      arc: Math.PI * 2,
    },
  },
  icosahedron: {
    kind: 'icosahedron',
    parameters: { radius: 0.5, detail: 0 },
  },
});

export function geometryDefaults(kind) {
  const geometry = GEOMETRY_DEFAULTS[kind];
  if (!geometry) throw new Error(`Unsupported geometry: ${kind}`);
  return structuredCloneSafe(geometry);
}

export function createMesh({
  id = createId(),
  name,
  parentId = null,
  geometry,
  material = defaultMaterial(),
  transform = defaultTransform(),
  visible = true,
  locked = false,
  editor = { templateRole: 'none' },
}) {
  return {
    id,
    type: 'mesh',
    name: assertName(name),
    parentId,
    visible,
    locked,
    transform: structuredCloneSafe(transform),
    editor: structuredCloneSafe(editor),
    geometry: structuredCloneSafe(geometry),
    material: structuredCloneSafe(material),
  };
}

export function createGroup({
  id = createId(),
  name,
  parentId = null,
  transform = defaultTransform(),
  visible = true,
  locked = false,
  editor = { templateRole: 'none' },
}) {
  return {
    id,
    type: 'group',
    name: assertName(name),
    parentId,
    visible,
    locked,
    transform: structuredCloneSafe(transform),
    editor: structuredCloneSafe(editor),
  };
}

export function createEmptyState(now = new Date().toISOString()) {
  return {
    project: {
      name: 'Untitled Project',
      createdAt: now,
      updatedAt: now,
    },
    settings: {
      units: 'meter',
      upAxis: 'Y',
      assetFront: '+Z',
      gridSize: 1,
      backgroundColor: '#1B1D22',
    },
    objects: [],
    selection: {
      selectedIds: [],
      activeId: null,
    },
    ui: {
      activeTool: 'select',
      loading: false,
      error: null,
    },
  };
}

export function structuredCloneSafe(value) {
  return typeof structuredClone === 'function'
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));
}

export function nextObjectName(objects, baseName) {
  const names = new Set(objects.map((object) => object.name));
  if (!names.has(baseName)) return baseName;
  let suffix = 2;
  while (names.has(`${baseName} ${suffix}`)) suffix += 1;
  return `${baseName} ${suffix}`;
}

export function geometryTriangleCount(geometry) {
  const parameters = geometry.parameters;
  switch (geometry.kind) {
    case 'box':
      return (
        4 *
        (parameters.widthSegments * parameters.heightSegments +
          parameters.widthSegments * parameters.depthSegments +
          parameters.heightSegments * parameters.depthSegments)
      );
    case 'sphere':
      return parameters.widthSegments * 2 * (parameters.heightSegments - 1);
    case 'cylinder': {
      const sides = parameters.radialSegments * parameters.heightSegments * 2;
      if (parameters.openEnded) return sides;
      const caps =
        (parameters.radiusTop > 0 ? parameters.radialSegments : 0) +
        (parameters.radiusBottom > 0 ? parameters.radialSegments : 0);
      return sides + caps;
    }
    case 'cone': {
      const sides = parameters.radialSegments * parameters.heightSegments;
      return sides + (parameters.openEnded ? 0 : parameters.radialSegments);
    }
    case 'plane':
      return parameters.widthSegments * parameters.heightSegments * 2;
    case 'torus':
      return parameters.radialSegments * parameters.tubularSegments * 2;
    case 'icosahedron':
      return 20 * 4 ** parameters.detail;
    default:
      throw new Error(`Unsupported geometry: ${geometry.kind}`);
  }
}

export function sceneTriangleCount(objects) {
  return objects.reduce(
    (total, object) =>
      object.type === 'mesh' ? total + geometryTriangleCount(object.geometry) : total,
    0,
  );
}
