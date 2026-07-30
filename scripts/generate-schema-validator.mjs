import { mkdir, readFile, writeFile } from 'node:fs/promises';
import Ajv2020 from 'ajv/dist/2020.js';
import standaloneCode from 'ajv/dist/standalone/index.js';
import addFormats from 'ajv-formats';

const schema = JSON.parse(await readFile('project.schema.v2.json', 'utf8'));
const ajv = new Ajv2020({
  allErrors: true,
  strict: true,
  code: { esm: true, lines: true, source: true },
});
addFormats(ajv);
const validate = ajv.compile(schema);
const standalone = standaloneCode(ajv, validate)
  .replace(
    'const func1 = require("ajv/dist/runtime/ucs2length").default;',
    [
      'import ucs2LengthModule from "ajv/dist/runtime/ucs2length.js";',
      'const func1 = ucs2LengthModule.default ?? ucs2LengthModule;',
    ].join('\n'),
  )
  .replace(
    'const formats0 = require("ajv-formats/dist/formats").fullFormats["date-time"];',
    [
      'import formatsModule from "ajv-formats/dist/formats.js";',
      'const formats0 = formatsModule.fullFormats["date-time"];',
    ].join('\n'),
  );
const source = [
  '// Generated from project.schema.v2.json. Do not edit by hand.',
  '// The standalone validator avoids eval/new Function in the browser.',
  standalone,
  '',
].join('\n');

await mkdir('src/generated', { recursive: true });
await writeFile('src/generated/validateProjectSchema.js', source, 'utf8');
