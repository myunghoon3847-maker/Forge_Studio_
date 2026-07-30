import { CommandManager } from './commands/CommandManager.js';
import { createEmptyState } from './domain/model.js';
import { EditorService } from './editor/EditorService.js';
import { EditorStore } from './state/EditorStore.js';
import { TemplateRegistry } from './templates/TemplateRegistry.js';
import { EditorApp } from './ui/EditorApp.js';

const store = new EditorStore(createEmptyState());
const commandManager = new CommandManager(store, { maxEntries: 100 });
commandManager.markSaved();
const templateRegistry = new TemplateRegistry();
const editorService = new EditorService({
  store,
  commandManager,
  templateRegistry,
});

const app = new EditorApp({
  store,
  commandManager,
  editorService,
  templateRegistry,
});

globalThis.__FORGE_STUDIO__ = {
  version: '0.6.0-alpha',
  getSummary: () => ({
    objectCount: store.getState().objects.length,
    selectedIds: [...store.getState().selection.selectedIds],
    activeTool: store.getState().ui.activeTool,
    dirty: commandManager.isDirty,
  }),
};

window.addEventListener('pagehide', () => app.sceneAdapter?.dispose(), { once: true });
