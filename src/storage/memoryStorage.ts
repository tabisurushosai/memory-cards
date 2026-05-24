import type { StorageAdapter, StorageKey } from "./StorageAdapter";

export class MemoryStorageAdapter implements StorageAdapter {
  private readonly values = new Map<StorageKey, unknown>();

  async read(key: StorageKey): Promise<unknown | undefined> {
    return this.values.get(key);
  }

  async write(key: StorageKey, value: unknown): Promise<void> {
    this.values.set(key, value);
  }
}
