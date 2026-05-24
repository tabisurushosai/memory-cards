/**
 * Platform-neutral local key/value persistence boundary.
 *
 * Implementations should only move values in and out of local storage. App-state
 * defaults and normalization stay in src/core and AppStorage.
 */
export interface StorageAdapter {
  get(key: string): Promise<unknown | undefined>;
  set(key: string, value: unknown): Promise<void>;
}
