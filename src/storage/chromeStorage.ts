import type { StorageAdapter } from "./StorageAdapter";

export interface ChromeStorageArea {
  get(key: string): Promise<Record<string, unknown>>;
  set(items: Record<string, unknown>): Promise<void>;
}

export class ChromeStorageAdapter implements StorageAdapter {
  constructor(private readonly storageArea: ChromeStorageArea) {}

  async get<TValue>(key: string): Promise<TValue | undefined> {
    const result = await this.storageArea.get(key);
    return result[key] as TValue | undefined;
  }

  async set<TValue>(key: string, value: TValue): Promise<void> {
    await this.storageArea.set({ [key]: value });
  }
}
