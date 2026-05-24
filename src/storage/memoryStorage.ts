import type { StorageAdapter } from "./AppStorage";

export class MemoryStorageAdapter implements StorageAdapter {
  private readonly values = new Map<string, unknown>();

  async get<TValue>(key: string): Promise<TValue | undefined> {
    return this.values.get(key) as TValue | undefined;
  }

  async set<TValue>(key: string, value: TValue): Promise<void> {
    this.values.set(key, value);
  }
}
