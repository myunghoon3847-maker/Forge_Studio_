import { AppError } from './AppError.js';
import { assertValidProject } from './ProjectValidator.js';
import { stateFromProject } from './ProjectSerializer.js';
import { migrateV05 } from './migrations/migrateV05.js';

export const MAX_PROJECT_BYTES = 20 * 1024 * 1024;

export function parseProjectText(text, { filename = 'project.forge.json', now, idFactory } = {}) {
  if (!filename.toLocaleLowerCase().endsWith('.json')) {
    throw new AppError('PROJECT_EXTENSION_INVALID', 'JSON 프로젝트 파일만 열 수 있습니다.');
  }
  if (new TextEncoder().encode(text).byteLength > MAX_PROJECT_BYTES) {
    throw new AppError('PROJECT_FILE_TOO_LARGE', '프로젝트 파일은 20MB 이하여야 합니다.');
  }
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (cause) {
    throw new AppError('PROJECT_JSON_INVALID', '프로젝트 JSON을 읽을 수 없습니다.', cause.message, {
      cause,
    });
  }
  if (Number.isInteger(parsed?.schemaVersion) && parsed.schemaVersion > 2) {
    throw new AppError(
      'PROJECT_SCHEMA_UNSUPPORTED',
      `Schema v${parsed.schemaVersion}은 이 버전에서 지원하지 않습니다.`,
    );
  }
  const project =
    parsed?.schemaVersion === 2
      ? parsed
      : migrateV05(parsed, { now, idFactory, projectName: filename.replace(/\.json$/iu, '') });
  assertValidProject(project);
  return { project, state: stateFromProject(project), migrated: parsed?.schemaVersion !== 2 };
}
