import { type AppStorage, type KeyValueStorageArea } from "./AppStorage";
import { ChromeAppStorage } from "./chromeStorage";
import { MemoryAppStorage } from "./memoryStorage";

interface ChromeStorageGlobal {
  storage?: {
    local?: KeyValueStorageArea;
  };
}

export function createAppStorage(): AppStorage {
  const chromeStorageArea = getChromeLocalStorageArea();

  if (chromeStorageArea) {
    return new ChromeAppStorage(chromeStorageArea);
  }

  return new MemoryAppStorage();
}

function getChromeLocalStorageArea(): KeyValueStorageArea | undefined {
  const chromeGlobal = (globalThis as typeof globalThis & { chrome?: ChromeStorageGlobal }).chrome;
  return chromeGlobal?.storage?.local;
}
