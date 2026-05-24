import { createAppStorageFromAdapter, type AppStorage } from "./AppStorage";
import { ChromeStorageAdapter, type ChromeStorageArea } from "./chromeStorage";
import { MemoryStorageAdapter } from "./memoryStorage";

interface ChromeStorageGlobal {
  storage?: {
    local?: ChromeStorageArea;
  };
}

export function createChromeExtensionAppStorage(): AppStorage {
  const chromeStorageArea = getChromeLocalStorageArea();
  const adapter = chromeStorageArea
    ? new ChromeStorageAdapter(chromeStorageArea)
    : new MemoryStorageAdapter();

  return createAppStorageFromAdapter(adapter);
}

function getChromeLocalStorageArea(): ChromeStorageArea | undefined {
  const chromeGlobal = (globalThis as typeof globalThis & { chrome?: ChromeStorageGlobal }).chrome;
  return chromeGlobal?.storage?.local;
}
