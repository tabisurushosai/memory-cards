import type { AppState } from "../core/appState";
import {
  APP_STORAGE_KEY,
  type AppStorage,
  type KeyValueStorageArea,
  type StoredAppState
} from "./AppStorage";

export class ChromeAppStorage implements AppStorage {
  constructor(private readonly storageArea: KeyValueStorageArea) {}

  async load(): Promise<StoredAppState | undefined> {
    const result = await this.storageArea.get(APP_STORAGE_KEY);
    return result[APP_STORAGE_KEY] as StoredAppState | undefined;
  }

  async save(state: AppState): Promise<void> {
    await this.storageArea.set({ [APP_STORAGE_KEY]: state });
  }
}
