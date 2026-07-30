import { mkdir, writeFile } from 'node:fs/promises';
import {
  createEmptyState,
  createMesh,
  defaultMaterial,
  defaultTransform,
} from '../src/domain/model.js';
import { projectFromState } from '../src/io/ProjectSerializer.js';

const now = '2026-07-30T00:00:00.000Z';
const state = createEmptyState(now);
state.project.name = 'Forge Studio Performance Scene';

function colorFor(index) {
  const hue = (index * 137.508) % 360;
  const h = hue / 60;
  const chroma = 0.58;
  const x = chroma * (1 - Math.abs((h % 2) - 1));
  const [red, green, blue] =
    h < 1
      ? [chroma, x, 0]
      : h < 2
        ? [x, chroma, 0]
        : h < 3
          ? [0, chroma, x]
          : h < 4
            ? [0, x, chroma]
            : h < 5
              ? [x, 0, chroma]
              : [chroma, 0, x];
  const offset = 0.2;
  return `#${[red, green, blue]
    .map((component) =>
      Math.round((component + offset) * 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')
    .toUpperCase()}`;
}

for (let index = 0; index < 200; index += 1) {
  const x = (index % 20) * 1.25 - 11.875;
  const z = Math.floor(index / 20) * 1.25 - 5.625;
  state.objects.push(
    createMesh({
      id: `60000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`,
      name: `Performance Mesh ${index + 1}`,
      geometry: {
        kind: 'sphere',
        parameters: { radius: 0.45, widthSegments: 25, heightSegments: 11 },
      },
      material: defaultMaterial(colorFor(index % 30)),
      transform: defaultTransform([x, 0.5, z]),
    }),
  );
}

const project = projectFromState(state, { now });
await mkdir('tests/fixtures/v2', { recursive: true });
await writeFile(
  'tests/fixtures/v2/performance-scene.forge.json',
  `${JSON.stringify(project, null, 2)}\n`,
  'utf8',
);
