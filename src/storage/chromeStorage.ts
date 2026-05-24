import type { StorageAdapter } from "./StorageAdapter";

export interface ChromeStorageArea {
  get(key: string): Promise<Record<string, unknown>>;
  set(items: Record<string, unknown>): Promise<void>;
}

export class ChromeStorageAdapter implements StorageAdapter {
  constructor(private readonly storageArea: ChromeStorageArea) {}

  async get(key: string): Promise<unknown | undefined> {
    const result = await this.storageArea.get(key);
    return result[key];
  }

  async set(key: string, value: unknown): Promise<void> {
    await this.storageArea.set({ [key]: value });
  }
}
