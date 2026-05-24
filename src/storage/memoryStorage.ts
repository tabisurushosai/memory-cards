import type { StorageAdapter } from "./StorageAdapter";

export class MemoryStorageAdapter implements StorageAdapter {
  private readonly values = new Map<string, unknown>();

  async get(key: string): Promise<unknown | undefined> {
    return this.values.get(key);
  }

  async set(key: string, value: unknown): Promise<void> {
    this.values.set(key, value);
  }
}
