import type { AppState } from "../core/appState";

export const APP_STORAGE_KEY = "memoryCardsState";

export type StoredAppState = Partial<AppState>;

export interface KeyValueStorageArea {
  get(key: string): Promise<Record<string, unknown>>;
  set(items: Record<string, unknown>): Promise<void>;
}

export interface AppStorage {
  load(): Promise<StoredAppState | undefined>;
  save(state: AppState): Promise<void>;
}
