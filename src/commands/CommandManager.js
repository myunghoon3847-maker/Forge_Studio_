import { structuredCloneSafe } from '../domain/model.js';

function restoreWithTransient(snapshot, current) {
  const restored = structuredCloneSafe(snapshot);
  const ids = new Set(restored.objects.map((object) => object.id));
  const selectedIds = current.selection.selectedIds.filter((id) => ids.has(id));
  restored.selection = {
    selectedIds,
    activeId: selectedIds.includes(current.selection.activeId)
      ? current.selection.activeId
      : (selectedIds.at(-1) ?? null),
  };
  restored.ui = structuredCloneSafe(current.ui);
  return restored;
}

export class SnapshotCommand {
  constructor(label, producer, { mergeKey = null, timestamp = Date.now() } = {}) {
    this.label = label;
    this.producer = producer;
    this.mergeKey = mergeKey;
    this.timestamp = timestamp;
  }

  execute(state) {
    const draft = structuredCloneSafe(state);
    const result = this.producer(draft);
    return result ?? draft;
  }

  canMerge(previous) {
    return (
      this.mergeKey &&
      previous?.command.mergeKey === this.mergeKey &&
      this.timestamp - previous.command.timestamp <= 500
    );
  }
}

export class CommandManager {
  constructor(store, { maxEntries = 100 } = {}) {
    this.store = store;
    this.maxEntries = maxEntries;
    this.undoStack = [];
    this.redoStack = [];
    this.revisionCounter = 0;
    this.currentRevision = 0;
    this.savedRevision = 0;
  }

  execute(command) {
    const beforeState = this.store.getState();
    const afterState = command.execute(beforeState);
    const afterRevision = ++this.revisionCounter;
    const previous = this.undoStack.at(-1);
    if (command.canMerge(previous) && previous.afterRevision !== this.savedRevision) {
      previous.afterState = structuredCloneSafe(afterState);
      previous.afterRevision = afterRevision;
      previous.command = command;
    } else {
      this.undoStack.push({
        command,
        beforeState: structuredCloneSafe(beforeState),
        afterState: structuredCloneSafe(afterState),
        beforeRevision: this.currentRevision,
        afterRevision,
      });
      if (this.undoStack.length > this.maxEntries) this.undoStack.shift();
    }
    this.redoStack = [];
    this.currentRevision = afterRevision;
    this.store.setState(afterState, `command:${command.label}`);
    return afterState;
  }

  executeState(label, producer, options) {
    return this.execute(new SnapshotCommand(label, producer, options));
  }

  undo() {
    const entry = this.undoStack.pop();
    if (!entry) return false;
    this.redoStack.push(entry);
    this.currentRevision = entry.beforeRevision;
    this.store.setState(
      restoreWithTransient(entry.beforeState, this.store.getState()),
      `undo:${entry.command.label}`,
    );
    return true;
  }

  redo() {
    const entry = this.redoStack.pop();
    if (!entry) return false;
    this.undoStack.push(entry);
    this.currentRevision = entry.afterRevision;
    this.store.setState(
      restoreWithTransient(entry.afterState, this.store.getState()),
      `redo:${entry.command.label}`,
    );
    return true;
  }

  markSaved() {
    this.savedRevision = this.currentRevision;
  }

  get isDirty() {
    return this.currentRevision !== this.savedRevision;
  }

  get canUndo() {
    return this.undoStack.length > 0;
  }

  get canRedo() {
    return this.redoStack.length > 0;
  }

  clear({ markSaved = true } = {}) {
    this.undoStack = [];
    this.redoStack = [];
    this.currentRevision = ++this.revisionCounter;
    if (markSaved) this.savedRevision = this.currentRevision;
  }
}
