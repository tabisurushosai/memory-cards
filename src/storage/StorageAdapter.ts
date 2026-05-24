/**
 * Platform-neutral local key/value persistence boundary.
 *
 * Implementations should only move values in and out of local storage. App-state
 * defaults and normalization stay in src/core and AppStorage.
 */
export type StorageKey = string;

export interface StorageAdapter {
  read(key: StorageKey): Promise<unknown | undefined>;
  write(key: StorageKey, value: unknown): Promise<void>;
}
