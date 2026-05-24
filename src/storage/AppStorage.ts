import type { AppState, AppStateSnapshot } from "../core/appState";
import type { StorageAdapter } from "./StorageAdapter";

export const APP_STORAGE_KEY = "memoryCardsState";

export type StoredAppState = AppStateSnapshot;

export interface AppStorage {
  load(): Promise<StoredAppState | undefined>;
  save(state: Readonly<AppState>): Promise<void>;
}

export function createAppStorageFromAdapter(adapter: StorageAdapter): AppStorage {
  return new AdapterAppStorage(adapter);
}

export class AdapterAppStorage implements AppStorage {
  constructor(private readonly adapter: StorageAdapter) {}

  async load(): Promise<StoredAppState | undefined> {
    const value = await this.adapter.get(APP_STORAGE_KEY);
    return value as StoredAppState | undefined;
  }

  async save(state: Readonly<AppState>): Promise<void> {
    await this.adapter.set(APP_STORAGE_KEY, state);
  }
}
