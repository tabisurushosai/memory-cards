import type { AppState } from "../core/appState";
import type { StorageAdapter } from "./StorageAdapter";

export type { StorageAdapter } from "./StorageAdapter";

export const APP_STORAGE_KEY = "memoryCardsState";

export type StoredAppState = Readonly<Partial<AppState>>;

export interface AppStorage {
  load(): Promise<StoredAppState | undefined>;
  save(state: Readonly<AppState>): Promise<void>;
}

export class AdapterAppStorage implements AppStorage {
  constructor(private readonly adapter: StorageAdapter) {}

  async load(): Promise<StoredAppState | undefined> {
    return this.adapter.get<StoredAppState>(APP_STORAGE_KEY);
  }

  async save(state: Readonly<AppState>): Promise<void> {
    await this.adapter.set(APP_STORAGE_KEY, state);
  }
}
