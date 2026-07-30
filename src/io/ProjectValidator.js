import schema from '../../project.schema.v2.json';
import { MAX_DEPTH, MAX_OBJECTS, validateName } from '../domain/model.js';
import validateSchema from '../generated/validateProjectSchema.js';
import { AppError } from './AppError.js';

const DANGEROUS_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

export function findDangerousKey(value, path = '$') {
  if (!value || typeof value !== 'object') return null;
  for (const key of Object.keys(value)) {
    if (DANGEROUS_KEYS.has(key)) return `${path}.${key}`;
    const nested = findDangerousKey(value[key], `${path}.${key}`);
    if (nested) return nested;
  }
  return null;
}

export function validateSemantic(project) {
  const errors = [];
  const objects = project.scene.objects;
  if (objects.length > MAX_OBJECTS) errors.push(`Scene exceeds ${MAX_OBJECTS} objects.`);
  const byId = new Map();
  for (const object of objects) {
    if (byId.has(object.id)) errors.push(`Duplicate object ID: ${object.id}`);
    byId.set(object.id, object);
    if (!validateName(object.name)) errors.push(`Invalid object name at ${object.id}.`);
  }
  for (const object of objects) {
    if (object.parentId !== null) {
      const parent = byId.get(object.parentId);
      if (!parent) errors.push(`Missing parent ${object.parentId} for ${object.id}.`);
      else if (parent.type !== 'group') errors.push(`Parent ${parent.id} is not a group.`);
    }
  }
  for (const object of objects) {
    let current = object;
    const visited = new Set([object.id]);
    let depth = 0;
    while (current.parentId !== null) {
      depth += 1;
      if (depth > MAX_DEPTH) {
        errors.push(`Hierarchy depth exceeds ${MAX_DEPTH} at ${object.id}.`);
        break;
      }
      if (visited.has(current.parentId)) {
        errors.push(`Hierarchy cycle detected at ${object.id}.`);
        break;
      }
      visited.add(current.parentId);
      current = byId.get(current.parentId);
      if (!current) break;
    }
  }
  for (const object of objects) {
    const editor = object.editor;
    if (!editor || editor.templateRole === 'none') continue;
    if (!editor.templateId || !editor.templateVersion) {
      errors.push(`Template metadata is incomplete at ${object.id}.`);
      continue;
    }
    if (editor.templateRole === 'root' && editor.templateRootId !== object.id) {
      errors.push(`Template root reference is invalid at ${object.id}.`);
    }
    if (editor.templateRole === 'part') {
      const root = byId.get(editor.templateRootId);
      if (
        !root ||
        root.type !== 'group' ||
        root.editor?.templateRole !== 'root' ||
        root.editor?.templateId !== editor.templateId
      ) {
        errors.push(`Template part reference is invalid at ${object.id}.`);
      }
    }
  }
  return errors;
}

export function validateProject(project) {
  const dangerousPath = findDangerousKey(project);
  if (dangerousPath) {
    return {
      valid: false,
      errors: [`Dangerous object key is not allowed: ${dangerousPath}`],
    };
  }
  const schemaValid = validateSchema(project);
  const schemaErrors = schemaValid
    ? []
    : (validateSchema.errors ?? []).map(
        (error) => `${error.instancePath || '$'} ${error.message ?? 'is invalid'}`,
      );
  if (!schemaValid) return { valid: false, errors: schemaErrors };
  const semanticErrors = validateSemantic(project);
  return { valid: semanticErrors.length === 0, errors: semanticErrors };
}

export function assertValidProject(project) {
  const result = validateProject(project);
  if (!result.valid) {
    throw new AppError(
      'PROJECT_REFERENCE_INVALID',
      '프로젝트 구조가 올바르지 않습니다.',
      result.errors.join('\n'),
    );
  }
  return project;
}

export { schema as projectSchema };
