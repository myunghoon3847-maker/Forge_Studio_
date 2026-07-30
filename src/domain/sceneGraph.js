import {
  composeMatrix,
  decomposeMatrix,
  identityMatrix,
  invertMatrix,
  matrixMaxError,
  multiplyMatrices,
  transformPoint,
} from './math.js';

export function objectMap(objects) {
  return new Map(objects.map((object) => [object.id, object]));
}

export function childrenOf(objects, parentId) {
  return objects.filter((object) => object.parentId === parentId);
}

export function ancestorIds(objects, id) {
  const byId = objectMap(objects);
  const ancestors = [];
  let current = byId.get(id);
  const visited = new Set();
  while (current?.parentId) {
    if (visited.has(current.parentId)) throw new Error('Scene hierarchy contains a cycle.');
    visited.add(current.parentId);
    ancestors.push(current.parentId);
    current = byId.get(current.parentId);
  }
  return ancestors;
}

export function normalizeTopLevelSelection(objects, ids) {
  const existing = [...new Set(ids)].filter((id) => objects.some((object) => object.id === id));
  const selected = new Set(existing);
  return existing.filter(
    (id) => !ancestorIds(objects, id).some((ancestor) => selected.has(ancestor)),
  );
}

export function effectiveState(objects, id) {
  const byId = objectMap(objects);
  let current = byId.get(id);
  let visible = true;
  let locked = false;
  const visited = new Set();
  while (current) {
    if (visited.has(current.id)) throw new Error('Scene hierarchy contains a cycle.');
    visited.add(current.id);
    visible &&= current.visible;
    locked ||= current.locked;
    current = current.parentId ? byId.get(current.parentId) : null;
  }
  return { visible, locked };
}

export function worldMatrix(objects, id, cache = new Map()) {
  if (cache.has(id)) return cache.get(id);
  const byId = objectMap(objects);
  const object = byId.get(id);
  if (!object) throw new Error(`Object not found: ${id}`);
  const local = composeMatrix(object.transform);
  const result = object.parentId
    ? multiplyMatrices(worldMatrix(objects, object.parentId, cache), local)
    : local;
  cache.set(id, result);
  return result;
}

function geometryBounds(geometry) {
  const p = geometry.parameters;
  switch (geometry.kind) {
    case 'box':
      return [
        [-p.width / 2, -p.height / 2, -p.depth / 2],
        [p.width / 2, p.height / 2, p.depth / 2],
      ];
    case 'sphere':
    case 'icosahedron':
      return [
        [-p.radius, -p.radius, -p.radius],
        [p.radius, p.radius, p.radius],
      ];
    case 'cylinder': {
      const radius = Math.max(p.radiusTop, p.radiusBottom);
      return [
        [-radius, -p.height / 2, -radius],
        [radius, p.height / 2, radius],
      ];
    }
    case 'cone':
      return [
        [-p.radius, -p.height / 2, -p.radius],
        [p.radius, p.height / 2, p.radius],
      ];
    case 'plane':
      return [
        [-p.width / 2, -p.height / 2, 0],
        [p.width / 2, p.height / 2, 0],
      ];
    case 'torus': {
      const radius = p.radius + p.tube;
      return [
        [-radius, -radius, -p.tube],
        [radius, radius, p.tube],
      ];
    }
    default:
      throw new Error(`Unsupported geometry: ${geometry.kind}`);
  }
}

function transformedBounds(matrix, bounds) {
  const [minimum, maximum] = bounds;
  const points = [];
  for (const x of [minimum[0], maximum[0]]) {
    for (const y of [minimum[1], maximum[1]]) {
      for (const z of [minimum[2], maximum[2]]) {
        points.push(transformPoint(matrix, [x, y, z]));
      }
    }
  }
  return {
    min: [0, 1, 2].map((axis) => Math.min(...points.map((point) => point[axis]))),
    max: [0, 1, 2].map((axis) => Math.max(...points.map((point) => point[axis]))),
  };
}

export function subtreeIds(objects, rootId) {
  const ids = [];
  const visit = (id) => {
    ids.push(id);
    for (const child of childrenOf(objects, id)) visit(child.id);
  };
  visit(rootId);
  return ids;
}

export function worldBoundsForIds(objects, ids) {
  const byId = objectMap(objects);
  const meshes = new Set();
  for (const id of ids) {
    for (const descendantId of subtreeIds(objects, id)) {
      if (byId.get(descendantId)?.type === 'mesh') meshes.add(descendantId);
    }
  }
  if (!meshes.size) throw new Error('Selection has no renderable geometry.');
  const cache = new Map();
  const bounds = [...meshes].map((id) => {
    const object = byId.get(id);
    return transformedBounds(worldMatrix(objects, id, cache), geometryBounds(object.geometry));
  });
  return {
    min: [0, 1, 2].map((axis) => Math.min(...bounds.map((entry) => entry.min[axis]))),
    max: [0, 1, 2].map((axis) => Math.max(...bounds.map((entry) => entry.max[axis]))),
  };
}

export function reparentTransform(objects, id, newParentId) {
  const originalWorld = worldMatrix(objects, id);
  const parentWorld = newParentId ? worldMatrix(objects, newParentId) : identityMatrix();
  const localMatrix = multiplyMatrices(invertMatrix(parentWorld), originalWorld);
  const transform = decomposeMatrix(localMatrix);
  if (matrixMaxError(localMatrix, composeMatrix(transform)) > 1e-6) {
    throw new Error('World transform cannot be preserved without shear.');
  }
  return transform;
}

export function worldTransformError(objectsBefore, objectsAfter, id) {
  return matrixMaxError(worldMatrix(objectsBefore, id), worldMatrix(objectsAfter, id));
}
