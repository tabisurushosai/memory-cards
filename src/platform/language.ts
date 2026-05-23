interface ChromeI18nGlobal {
  i18n?: {
    getUILanguage?: () => string;
  };
}

export function getPreferredLanguage(): string {
  return getChromeLanguage() ?? getNavigatorLanguage() ?? "ja";
}

function getChromeLanguage(): string | undefined {
  const chromeGlobal = (globalThis as typeof globalThis & { chrome?: ChromeI18nGlobal }).chrome;
  return chromeGlobal?.i18n?.getUILanguage?.();
}

function getNavigatorLanguage(): string | undefined {
  if (typeof navigator === "undefined") {
    return undefined;
  }

  return navigator.language;
}
