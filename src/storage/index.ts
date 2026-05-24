import { AdapterAppStorage, type AppStorage } from "./AppStorage";
import { ChromeStorageAdapter, type ChromeStorageArea } from "./chromeStorage";
import { MemoryStorageAdapter } from "./memoryStorage";

interface ChromeStorageGlobal {
  storage?: {
    local?: ChromeStorageArea;
  };
}

export function createAppStorage(): AppStorage {
  const chromeStorageArea = getChromeLocalStorageArea();

  if (chromeStorageArea) {
    return new AdapterAppStorage(new ChromeStorageAdapter(chromeStorageArea));
  }

  return new AdapterAppStorage(new MemoryStorageAdapter());
}

function getChromeLocalStorageArea(): ChromeStorageArea | undefined {
  const chromeGlobal = (globalThis as typeof globalThis & { chrome?: ChromeStorageGlobal }).chrome;
  return chromeGlobal?.storage?.local;
}
