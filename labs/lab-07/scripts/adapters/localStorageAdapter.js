// scripts/adapters/localStorageAdapter.js
// Persistent adapter (LocalStorage) - Same contract: load(), save(next), reset(), snapshot()
import { seedDoc } from "../model.js";

export class LocalStorageAdapter {
  #key;
  #stampOnSave;

  constructor({ key = "mockdb:doc", stampOnSave = true } = {}) {
    this.#key = key;
    this.#stampOnSave = stampOnSave;

    // bind so callbacks don't lose `this`
    this.load = this.load.bind(this);
    this.save = this.save.bind(this);
    this.reset = this.reset.bind(this);
    this.snapshot = this.snapshot.bind(this);
  }

  #stamp(d) {
    d.rev = (d.rev ?? 0) + 1;
    d.updatedAt = new Date().toISOString();
  }

  #seedAndSave() {
    // ensure a fresh doc object each time we seed
    const base = seedDoc();
    const d =
      typeof structuredClone === "function"
        ? structuredClone(base)
        : JSON.parse(JSON.stringify(base));

    localStorage.setItem(this.#key, JSON.stringify(d));
    return d;
  }

  async load() {
    try {
      const raw = localStorage.getItem(this.#key);
      return raw ? JSON.parse(raw) : this.#seedAndSave();
    } catch {
      // Corrupt JSON or inaccessible storage → reseed
      return this.#seedAndSave();
    }
  }

  async save(next) {
    if (this.#stampOnSave) this.#stamp(next);
    localStorage.setItem(this.#key, JSON.stringify(next));
  }

  reset() {
    localStorage.removeItem(this.#key);
  }

  snapshot() {
    const raw = localStorage.getItem(this.#key);
    return raw ? JSON.parse(raw) : null;
  }
}

export const localStorageAdapter = new LocalStorageAdapter();
