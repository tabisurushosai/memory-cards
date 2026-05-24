import { getChromeGlobal } from "./chromeGlobal";

interface ChromeI18nGlobal {
  i18n?: {
    getUILanguage?: () => string;
  };
}

export function getPreferredLanguage(): string {
  return getChromeLanguage() ?? getNavigatorLanguage() ?? "ja";
}

function getChromeLanguage(): string | undefined {
  const chromeGlobal = getChromeGlobal<ChromeI18nGlobal>();
  return chromeGlobal?.i18n?.getUILanguage?.();
}

function getNavigatorLanguage(): string | undefined {
  if (typeof navigator === "undefined") {
    return undefined;
  }

  return navigator.language;
}
