import {
  createGroup,
  createId,
  createMesh,
  defaultMaterial,
  defaultTransform,
  geometryTriangleCount,
} from '../domain/model.js';
import { worldBoundsForIds } from '../domain/sceneGraph.js';

const box = (width, height, depth) => ({
  kind: 'box',
  parameters: {
    width,
    height,
    depth,
    widthSegments: 1,
    heightSegments: 1,
    depthSegments: 1,
  },
});
const sphere = (radius, widthSegments = 8, heightSegments = 6) => ({
  kind: 'sphere',
  parameters: { radius, widthSegments, heightSegments },
});
const cylinder = (radiusTop, radiusBottom, height, radialSegments = 8, openEnded = false) => ({
  kind: 'cylinder',
  parameters: {
    radiusTop,
    radiusBottom,
    height,
    radialSegments,
    heightSegments: 1,
    openEnded,
  },
});
const cone = (radius, height, radialSegments = 8) => ({
  kind: 'cone',
  parameters: { radius, height, radialSegments, heightSegments: 1, openEnded: false },
});
const torus = (radius, tube, radialSegments = 6, tubularSegments = 12) => ({
  kind: 'torus',
  parameters: { radius, tube, radialSegments, tubularSegments, arc: Math.PI * 2 },
});
const icosahedron = (radius, detail = 0) => ({
  kind: 'icosahedron',
  parameters: { radius, detail },
});
const material = (color, roughness = 0.72, metalness = 0.05, overrides = {}) =>
  defaultMaterial(color, { roughness, metalness, ...overrides });
const part = (
  name,
  geometry,
  color,
  position,
  { rotation = [0, 0, 0], scale = [1, 1, 1], roughness, metalness, flatShading } = {},
) => ({
  name,
  geometry,
  material: material(color, roughness, metalness, { flatShading }),
  transform: {
    position,
    rotation: { order: 'XYZ', radians: rotation },
    scale,
  },
});

export const TEMPLATE_DEFINITIONS = [
  {
    templateId: 'nature.oak',
    version: '1.0.0',
    name: '참나무',
    category: 'nature',
    icon: '🌳',
    maxTriangles: 1200,
    palette: ['#6F4A2B', '#3C8C4B', '#58A85A'],
    parts: [
      part('줄기', cylinder(0.34, 0.44, 2.2), '#6F4A2B', [0, 1.1, 0]),
      part('수관 1', icosahedron(0.72, 0), '#3C8C4B', [0, 2.35, 0], {
        flatShading: true,
      }),
      part('수관 2', icosahedron(0.56, 0), '#58A85A', [0.55, 2.2, 0.1], {
        flatShading: true,
      }),
      part('수관 3', icosahedron(0.56, 0), '#3C8C4B', [-0.55, 2.18, 0.12], {
        flatShading: true,
      }),
      part('수관 4', icosahedron(0.5, 0), '#58A85A', [0.05, 2.75, 0.05], {
        flatShading: true,
      }),
    ],
  },
  {
    templateId: 'nature.pine',
    version: '1.0.0',
    name: '소나무',
    category: 'nature',
    icon: '🌲',
    maxTriangles: 1000,
    palette: ['#6A472B', '#2F7040'],
    parts: [
      part('줄기', cylinder(0.24, 0.3, 2), '#6A472B', [0, 1, 0]),
      part('하단 잎', cone(1, 1.45), '#2F7040', [0, 1.65, 0]),
      part('중단 잎', cone(0.78, 1.25), '#397E47', [0, 2.35, 0]),
      part('상단 잎', cone(0.56, 1.05), '#2F7040', [0, 3, 0]),
    ],
  },
  {
    templateId: 'nature.bush',
    version: '1.0.0',
    name: '관목',
    category: 'nature',
    icon: '🌿',
    maxTriangles: 500,
    palette: ['#3E7F43', '#59A052'],
    parts: [
      part('잎 1', icosahedron(0.58, 1), '#3E7F43', [-0.4, 0.58, 0], {
        flatShading: true,
      }),
      part('잎 2', icosahedron(0.62, 1), '#59A052', [0.35, 0.62, 0.05], {
        flatShading: true,
      }),
      part('잎 3', icosahedron(0.5, 1), '#3E7F43', [0, 0.8, 0.38], {
        flatShading: true,
      }),
    ],
  },
  {
    templateId: 'nature.rock-small',
    version: '1.0.0',
    name: '소형 바위',
    category: 'nature',
    icon: '🪨',
    maxTriangles: 300,
    palette: ['#747982'],
    parts: [
      part('바위', icosahedron(0.72, 1), '#747982', [0, 0.52, 0], {
        scale: [1, 0.72, 0.86],
        rotation: [0.08, 0.3, -0.05],
        roughness: 1,
        flatShading: true,
      }),
    ],
  },
  {
    templateId: 'nature.rock-cluster',
    version: '1.0.0',
    name: '바위 군집',
    category: 'nature',
    icon: '⛰️',
    maxTriangles: 800,
    palette: ['#747982', '#656A72'],
    parts: [
      part('바위 1', icosahedron(0.72, 1), '#747982', [0, 0.52, 0], {
        scale: [1, 0.72, 0.85],
        flatShading: true,
      }),
      part('바위 2', icosahedron(0.46, 1), '#656A72', [-0.72, 0.34, 0.25], {
        scale: [1, 0.74, 0.9],
        rotation: [0, 0.55, 0],
        flatShading: true,
      }),
      part('바위 3', icosahedron(0.4, 1), '#7F848C', [0.68, 0.3, 0.3], {
        scale: [1, 0.75, 1.08],
        rotation: [0, -0.45, 0],
        flatShading: true,
      }),
    ],
  },
  {
    templateId: 'building.wood-house',
    version: '1.0.0',
    name: '목조 주택',
    category: 'building',
    icon: '🏠',
    maxTriangles: 3500,
    palette: ['#CDAE7F', '#7D4634', '#5B3922', '#73B4CF'],
    parts: [
      part('집 본체', box(3.2, 2.1, 2.6), '#CDAE7F', [0, 1.05, 0]),
      part('지붕', cone(2.35, 1.35, 4), '#7D4634', [0, 2.75, 0], {
        rotation: [0, Math.PI / 4, 0],
      }),
      part('문', box(0.8, 1.45, 0.12), '#5B3922', [0, 0.725, 1.36]),
      part('창문 왼쪽', box(0.56, 0.56, 0.1), '#73B4CF', [-0.92, 1.32, 1.37], {
        roughness: 0.25,
      }),
      part('창문 오른쪽', box(0.56, 0.56, 0.1), '#73B4CF', [0.92, 1.32, 1.37], {
        roughness: 0.25,
      }),
      part('굴뚝', box(0.42, 1.2, 0.42), '#68615C', [1.05, 3.05, 0]),
    ],
  },
  {
    templateId: 'building.watch-tower',
    version: '1.0.0',
    name: '감시탑',
    category: 'building',
    icon: '🗼',
    maxTriangles: 2500,
    palette: ['#745031', '#8C643D', '#6E3F35'],
    parts: [
      ...[
        [-0.8, 1.5, -0.8],
        [0.8, 1.5, -0.8],
        [-0.8, 1.5, 0.8],
        [0.8, 1.5, 0.8],
      ].map((position, index) =>
        part(`기둥 ${index + 1}`, cylinder(0.13, 0.18, 3), '#745031', position),
      ),
      part('상판', box(2.25, 0.22, 2.25), '#8C643D', [0, 3, 0]),
      part('지붕', cone(1.65, 1.1, 4), '#6E3F35', [0, 3.65, 0], {
        rotation: [0, Math.PI / 4, 0],
      }),
    ],
  },
  {
    templateId: 'building.fence',
    version: '1.0.0',
    name: '울타리',
    category: 'building',
    icon: '🪵',
    maxTriangles: 600,
    palette: ['#7C5633', '#98704A'],
    parts: [
      ...[-1.5, 0, 1.5].map((x, index) =>
        part(`말뚝 ${index + 1}`, box(0.22, 1.65, 0.22), '#7C5633', [x, 0.825, 0]),
      ),
      part('가로대 상단', box(3.35, 0.22, 0.2), '#98704A', [0, 1.18, 0]),
      part('가로대 하단', box(3.35, 0.22, 0.2), '#98704A', [0, 0.55, 0]),
    ],
  },
  {
    templateId: 'building.well',
    version: '1.0.0',
    name: '우물',
    category: 'building',
    icon: '🪣',
    maxTriangles: 1200,
    palette: ['#777B82', '#704A2C', '#824A3C'],
    parts: [
      part('우물 벽', cylinder(0.95, 0.95, 0.9, 12, true), '#777B82', [0, 0.45, 0], {
        roughness: 1,
      }),
      part('기둥 왼쪽', box(0.18, 2.2, 0.18), '#704A2C', [-1.05, 1.1, 0]),
      part('기둥 오른쪽', box(0.18, 2.2, 0.18), '#704A2C', [1.05, 1.1, 0]),
      part('지붕', cone(1.45, 0.9, 4), '#824A3C', [0, 2.35, 0], {
        rotation: [0, Math.PI / 4, 0],
      }),
    ],
  },
  {
    templateId: 'prop.crate',
    version: '1.0.0',
    name: '나무상자',
    category: 'prop',
    icon: '📦',
    maxTriangles: 400,
    palette: ['#96653A', '#5F3B22'],
    parts: [
      part('상자 본체', box(1.8, 1.8, 1.8), '#96653A', [0, 0.9, 0]),
      part('보강재 왼쪽', box(0.14, 1.9, 1.92), '#5F3B22', [-0.96, 0.95, 0]),
      part('보강재 오른쪽', box(0.14, 1.9, 1.92), '#5F3B22', [0.96, 0.95, 0]),
      part('보강재 앞', box(1.92, 0.14, 0.14), '#5F3B22', [0, 0.95, 0.96]),
      part('보강재 뒤', box(1.92, 0.14, 0.14), '#5F3B22', [0, 0.95, -0.96]),
    ],
  },
  {
    templateId: 'prop.barrel',
    version: '1.0.0',
    name: '나무통',
    category: 'prop',
    icon: '🛢️',
    maxTriangles: 600,
    palette: ['#8C5A30', '#4E535C'],
    parts: [
      part('통 몸체', cylinder(0.72, 0.72, 1.8, 10), '#8C5A30', [0, 0.9, 0]),
      ...[0.24, 0.9, 1.56].map((y, index) =>
        part(`금속 띠 ${index + 1}`, torus(0.73, 0.055), '#4E535C', [0, y, 0], {
          rotation: [Math.PI / 2, 0, 0],
          metalness: 0.65,
          roughness: 0.35,
        }),
      ),
    ],
  },
  {
    templateId: 'prop.chest',
    version: '1.0.0',
    name: '보물상자',
    category: 'prop',
    icon: '🧰',
    maxTriangles: 800,
    palette: ['#7E4E28', '#9A6235', '#D6B15C'],
    parts: [
      part('하단', box(2.2, 1, 1.4), '#7E4E28', [0, 0.5, 0]),
      part('뚜껑', cylinder(0.7, 0.7, 2.2, 10), '#9A6235', [0, 1.28, 0], {
        rotation: [0, 0, Math.PI / 2],
        scale: [1, 1, 0.75],
      }),
      part('잠금장치', box(0.3, 0.42, 0.12), '#D6B15C', [0, 0.86, 0.76], {
        metalness: 0.6,
      }),
    ],
  },
  {
    templateId: 'prop.table',
    version: '1.0.0',
    name: '테이블',
    category: 'prop',
    icon: '🪑',
    maxTriangles: 500,
    palette: ['#875E39', '#6E472A'],
    parts: [
      part('상판', box(2.5, 0.22, 1.45), '#875E39', [0, 1.5, 0]),
      ...[
        [-0.95, 0.7, -0.48],
        [0.95, 0.7, -0.48],
        [-0.95, 0.7, 0.48],
        [0.95, 0.7, 0.48],
      ].map((position, index) =>
        part(`다리 ${index + 1}`, box(0.22, 1.4, 0.22), '#6E472A', position),
      ),
    ],
  },
  {
    templateId: 'prop.chair',
    version: '1.0.0',
    name: '의자',
    category: 'prop',
    icon: '🪑',
    maxTriangles: 450,
    palette: ['#875E39', '#6E472A'],
    parts: [
      part('좌판', box(1.2, 0.18, 1.2), '#875E39', [0, 1, 0]),
      part('등받이', box(1.2, 1.25, 0.18), '#875E39', [0, 1.7, -0.52]),
      ...[
        [-0.42, 0.48, -0.42],
        [0.42, 0.48, -0.42],
        [-0.42, 0.48, 0.42],
        [0.42, 0.48, 0.42],
      ].map((position, index) =>
        part(`다리 ${index + 1}`, box(0.16, 0.96, 0.16), '#6E472A', position),
      ),
    ],
  },
  {
    templateId: 'prop.campfire',
    version: '1.0.0',
    name: '모닥불',
    category: 'prop',
    icon: '🔥',
    maxTriangles: 700,
    palette: ['#70452A', '#FF7B2F', '#FFD35A'],
    parts: [
      ...[0, Math.PI / 3, (Math.PI * 2) / 3].map((angle, index) =>
        part(`장작 ${index + 1}`, cylinder(0.11, 0.11, 1.5, 6), '#70452A', [0, 0.16, 0], {
          rotation: [Math.PI / 2, angle, 0],
        }),
      ),
      part('불꽃', cone(0.55, 1.3, 6), '#FF7B2F', [0, 0.75, 0], {
        roughness: 0.45,
      }),
    ],
  },
  {
    templateId: 'weapon.sword',
    version: '1.0.0',
    name: '검',
    category: 'weapon',
    icon: '⚔️',
    maxTriangles: 300,
    palette: ['#C7CED8', '#C99532', '#533426'],
    parts: [
      part('검날', box(0.28, 2.5, 0.1), '#C7CED8', [0, 2, 0], {
        metalness: 0.8,
        roughness: 0.2,
      }),
      part('검끝', cone(0.2, 0.5, 4), '#C7CED8', [0, 3.5, 0], {
        metalness: 0.8,
      }),
      part('가드', box(1.25, 0.18, 0.26), '#C99532', [0, 0.72, 0], {
        metalness: 0.65,
      }),
      part('손잡이', cylinder(0.13, 0.13, 0.72, 8), '#533426', [0, 0.28, 0]),
      part('폼멜', icosahedron(0.2, 0), '#C99532', [0, 0.02, 0], {
        metalness: 0.6,
      }),
    ],
  },
  {
    templateId: 'weapon.axe',
    version: '1.0.0',
    name: '도끼',
    category: 'weapon',
    icon: '🪓',
    maxTriangles: 350,
    palette: ['#6E452A', '#BFC6D0'],
    parts: [
      part('자루', cylinder(0.12, 0.15, 2.6, 8), '#6E452A', [0, 1.3, 0]),
      part('도끼 머리', box(0.8, 0.5, 0.28), '#BFC6D0', [0.2, 2.35, 0], {
        metalness: 0.75,
        roughness: 0.25,
      }),
      part('날', cone(0.48, 0.75, 4), '#D5DAE2', [0.75, 2.35, 0], {
        rotation: [0, 0, -Math.PI / 2],
        scale: [1, 1, 0.42],
        metalness: 0.8,
      }),
    ],
  },
  {
    templateId: 'weapon.shield',
    version: '1.0.0',
    name: '방패',
    category: 'weapon',
    icon: '🛡️',
    maxTriangles: 400,
    palette: ['#315D9B', '#B8BEC8'],
    parts: [
      part('방패 본체', cylinder(1.05, 1.05, 0.16, 12), '#315D9B', [0, 1.08, 0], {
        rotation: [Math.PI / 2, 0, 0],
      }),
      part('테두리', torus(0.94, 0.09), '#B8BEC8', [0, 1.08, 0.12], {
        metalness: 0.7,
        roughness: 0.3,
      }),
      part('보스', icosahedron(0.32, 0), '#B8BEC8', [0, 1.08, 0.23], {
        scale: [1, 1, 0.55],
        metalness: 0.75,
      }),
    ],
  },
  {
    templateId: 'weapon.spear',
    version: '1.0.0',
    name: '창',
    category: 'weapon',
    icon: '🔱',
    maxTriangles: 250,
    palette: ['#70472B', '#C7CED8'],
    parts: [
      part('창 자루', cylinder(0.08, 0.1, 3.4, 8), '#70472B', [0, 1.7, 0]),
      part('창날', cone(0.24, 0.9, 6), '#C7CED8', [0, 3.75, 0], {
        metalness: 0.8,
        roughness: 0.2,
      }),
      part('끝마개', icosahedron(0.13, 0), '#A8AEB7', [0, 0.05, 0], {
        metalness: 0.55,
      }),
    ],
  },
  {
    templateId: 'character.slime',
    version: '1.0.0',
    name: '슬라임',
    category: 'character',
    icon: '🟢',
    maxTriangles: 500,
    palette: ['#58B86D', '#183426', '#F5F5F5'],
    parts: [
      part('몸체', sphere(0.85, 12, 8), '#58B86D', [0, 0.7, 0], {
        scale: [1.12, 0.82, 1],
        roughness: 0.38,
      }),
      part('눈 왼쪽', icosahedron(0.12, 0), '#183426', [-0.28, 0.85, 0.72]),
      part('눈 오른쪽', icosahedron(0.12, 0), '#183426', [0.28, 0.85, 0.72]),
    ],
  },
];

export class TemplateRegistry {
  constructor(definitions = TEMPLATE_DEFINITIONS) {
    this.definitions = new Map();
    for (const definition of definitions) {
      if (this.definitions.has(definition.templateId)) {
        throw new Error(`Duplicate template ID: ${definition.templateId}`);
      }
      this.definitions.set(definition.templateId, definition);
    }
  }

  list({ category = 'all', query = '' } = {}) {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return [...this.definitions.values()].filter(
      (definition) =>
        (category === 'all' || definition.category === category) &&
        (!normalizedQuery ||
          `${definition.name} ${definition.templateId}`
            .toLocaleLowerCase()
            .includes(normalizedQuery)),
    );
  }

  get(templateId) {
    const definition = this.definitions.get(templateId);
    if (!definition) throw new Error(`Unknown template: ${templateId}`);
    return definition;
  }

  build(templateId, { idFactory = createId } = {}) {
    const definition = this.get(templateId);
    const rootId = idFactory();
    const root = createGroup({
      id: rootId,
      name: definition.name,
      transform: defaultTransform([0, 0, 0]),
      editor: {
        templateRole: 'root',
        templateId: definition.templateId,
        templateVersion: definition.version,
        templateRootId: rootId,
      },
    });
    const parts = definition.parts.map((definitionPart) =>
      createMesh({
        id: idFactory(),
        name: definitionPart.name,
        parentId: rootId,
        transform: definitionPart.transform,
        geometry: definitionPart.geometry,
        material: definitionPart.material,
        editor: {
          templateRole: 'part',
          templateId: definition.templateId,
          templateVersion: definition.version,
          templateRootId: rootId,
        },
      }),
    );
    const allObjects = [root, ...parts];
    const bounds = worldBoundsForIds(allObjects, [rootId]);
    const groundOffset = -bounds.min[1];
    for (const object of parts) object.transform.position[1] += groundOffset;
    return {
      definition,
      rootId,
      objects: allObjects,
      triangleCount: parts.reduce(
        (total, object) => total + geometryTriangleCount(object.geometry),
        0,
      ),
    };
  }
}
