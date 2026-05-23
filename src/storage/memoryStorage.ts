import type { AppState } from "../core/appState";
import { type AppStorage, type StoredAppState } from "./AppStorage";

export class MemoryAppStorage implements AppStorage {
  private state: StoredAppState | undefined;

  async load(): Promise<StoredAppState | undefined> {
    return this.state;
  }

  async save(state: AppState): Promise<void> {
    this.state = state;
  }
}
