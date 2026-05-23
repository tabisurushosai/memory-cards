import { AppState } from "../core/appState";

export interface AppStorage {
  load(): Promise<Partial<AppState> | undefined>;
  save(state: AppState): Promise<void>;
}
