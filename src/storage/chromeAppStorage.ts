import { createAppStorageFromAdapter, type AppStorage } from "./AppStorage";
import { ChromeStorageAdapter, type ChromeStorageArea } from "./chromeStorage";
import { MemoryStorageAdapter } from "./memoryStorage";
import { getChromeGlobal } from "../platform/chromeGlobal";

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
  const chromeGlobal = getChromeGlobal<ChromeStorageGlobal>();
  return chromeGlobal?.storage?.local;
}
