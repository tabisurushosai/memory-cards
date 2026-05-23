import { AppState } from "../core/appState";
import { AppStorage } from "./AppStorage";

const STORAGE_KEY = "memoryCardsState";

export class ChromeAppStorage implements AppStorage {
  async load(): Promise<Partial<AppState> | undefined> {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    return result[STORAGE_KEY] as Partial<AppState> | undefined;
  }

  async save(state: AppState): Promise<void> {
    await chrome.storage.local.set({ [STORAGE_KEY]: state });
  }
}
