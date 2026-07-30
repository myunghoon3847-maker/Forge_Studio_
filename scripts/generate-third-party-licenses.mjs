import { writeFile } from 'node:fs/promises';
import { init } from 'license-checker-rseidelsohn';

function scan(options = {}) {
  return new Promise((resolve, reject) => {
    init(
      {
        start: process.cwd(),
        excludePrivatePackages: true,
        ...options,
      },
      (error, packages) => {
        if (error) reject(error);
        else resolve(packages);
      },
    );
  });
}

const [allPackages, runtimePackages] = await Promise.all([scan(), scan({ production: true })]);
const runtimeNames = new Set(Object.keys(runtimePackages));
const rows = Object.entries(allPackages)
  .filter(([name]) => name !== 'forge-studio@0.6.0-alpha')
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([name, metadata]) => {
    const scope = runtimeNames.has(name) ? 'Runtime' : 'Development';
    const license = Array.isArray(metadata.licenses)
      ? metadata.licenses.join(' OR ')
      : metadata.licenses;
    const repository = metadata.repository || metadata.url || '';
    return `| \`${name.replaceAll('|', '\\|')}\` | ${scope} | ${String(license).replaceAll('|', '\\|')} | ${String(repository).replaceAll('|', '\\|')} |`;
  });

const unknown = rows.filter((row) => /\| (UNKNOWN|UNLICENSED) \|/u.test(row));
if (unknown.length) {
  throw new Error(`Unknown or unlicensed dependencies found:\n${unknown.join('\n')}`);
}

const markdown = `# Forge Studio Third-Party Licenses

- Generated from the installed dependency tree and \`package-lock.json\`.
- Generated at: ${new Date().toISOString()}
- Project source license: not granted by this file; product-owner approval is required before public distribution.
- Package count: ${rows.length}

| Package | Scope | SPDX/license | Repository |
|---|---|---|---|
${rows.join('\n')}

## Asset declaration

Forge Studio v0.6-alpha uses code-generated Three.js geometry, CSS, Unicode symbols, and the repository-owned SVG favicon. It includes no external model, texture, webfont, analytics, advertising, or telemetry asset.
`;

await writeFile('THIRD_PARTY_LICENSES.md', markdown, 'utf8');
