import type { StorageAdapter, StorageKey } from "./StorageAdapter";

export interface ChromeStorageArea {
  get(key: StorageKey): Promise<Record<StorageKey, unknown>>;
  set(items: Readonly<Record<StorageKey, unknown>>): Promise<void>;
}

export class ChromeStorageAdapter implements StorageAdapter {
  constructor(private readonly storageArea: ChromeStorageArea) {}

  async read(key: StorageKey): Promise<unknown | undefined> {
    const result = await this.storageArea.get(key);
    return result[key];
  }

  async write(key: StorageKey, value: unknown): Promise<void> {
    await this.storageArea.set({ [key]: value });
  }
}
