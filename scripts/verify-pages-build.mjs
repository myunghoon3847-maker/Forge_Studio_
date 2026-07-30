import { access, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDirectory = path.join(rootDirectory, 'dist');
const indexPath = path.join(distDirectory, 'index.html');

const indexHtml = await readFile(indexPath, 'utf8');
const references = [...indexHtml.matchAll(/\b(?:href|src)="([^"]+)"/gu)].map((match) => match[1]);

const errors = [];
const localReferences = references.filter(
  (reference) =>
    !reference.startsWith('data:') &&
    !reference.startsWith('http://') &&
    !reference.startsWith('https://'),
);

if (indexHtml.includes('/src/')) {
  errors.push('dist/index.html still references development-only /src files.');
}

for (const reference of localReferences) {
  if (reference.startsWith('/')) {
    errors.push(`Root-absolute reference is not repository-subpath safe: ${reference}`);
    continue;
  }

  const cleanReference = reference.split(/[?#]/u, 1)[0];
  const targetPath = path.resolve(distDirectory, cleanReference);
  if (targetPath !== distDirectory && !targetPath.startsWith(`${distDirectory}${path.sep}`)) {
    errors.push(`Reference escapes dist: ${reference}`);
    continue;
  }

  try {
    await access(targetPath);
    const targetStats = await stat(targetPath);
    if (!targetStats.isFile() || targetStats.size === 0) {
      errors.push(`Referenced asset is empty or not a file: ${reference}`);
    }
  } catch {
    errors.push(`Referenced asset is missing: ${reference}`);
  }
}

if (!localReferences.some((reference) => /\.css(?:[?#]|$)/u.test(reference))) {
  errors.push('The production HTML has no stylesheet reference.');
}

if (!localReferences.some((reference) => /\.js(?:[?#]|$)/u.test(reference))) {
  errors.push('The production HTML has no JavaScript module reference.');
}

try {
  await access(path.join(distDirectory, '.nojekyll'));
} catch {
  errors.push('dist/.nojekyll is missing.');
}

if (errors.length > 0) {
  throw new Error(`GitHub Pages artifact verification failed:\n- ${errors.join('\n- ')}`);
}

console.log(
  `GitHub Pages artifact verified: ${localReferences.length} relative asset references, no development paths.`,
);
