import { AppStorage } from "./AppStorage";
import { ChromeAppStorage } from "./chromeStorage";
import { MemoryAppStorage } from "./memoryStorage";

export function createAppStorage(): AppStorage {
  if (typeof chrome !== "undefined" && chrome.storage?.local) {
    return new ChromeAppStorage();
  }

  return new MemoryAppStorage();
}
