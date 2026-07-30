export class EditorStore {
  #state;
  #listeners = new Set();

  constructor(initialState) {
    this.#state = initialState;
  }

  getState() {
    return this.#state;
  }

  setState(nextState, reason = 'state') {
    this.#state = nextState;
    for (const listener of this.#listeners) listener(this.#state, reason);
  }

  update(updater, reason = 'state') {
    this.setState(updater(this.#state), reason);
  }

  subscribe(listener) {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }
}
