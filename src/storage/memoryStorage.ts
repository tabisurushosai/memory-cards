import { AppState } from "../core/appState";
import { AppStorage } from "./AppStorage";

export class MemoryAppStorage implements AppStorage {
  private state: Partial<AppState> | undefined;

  async load(): Promise<Partial<AppState> | undefined> {
    return this.state;
  }

  async save(state: AppState): Promise<void> {
    this.state = state;
  }
}
