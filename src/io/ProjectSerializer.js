import { APP_VERSION, SCHEMA_VERSION, structuredCloneSafe } from '../domain/model.js';

export function projectFromState(state, { now = new Date().toISOString() } = {}) {
  return {
    schemaVersion: SCHEMA_VERSION,
    appVersion: APP_VERSION,
    project: {
      ...structuredCloneSafe(state.project),
      updatedAt: now,
    },
    settings: structuredCloneSafe(state.settings),
    scene: {
      objects: structuredCloneSafe(state.objects),
    },
  };
}

export function serializeProject(state, options) {
  return JSON.stringify(projectFromState(state, options), null, 2);
}

export function stateFromProject(project) {
  return {
    project: structuredCloneSafe(project.project),
    settings: structuredCloneSafe(project.settings),
    objects: structuredCloneSafe(project.scene.objects),
    selection: { selectedIds: [], activeId: null },
    ui: { activeTool: 'select', loading: false, error: null },
  };
}
