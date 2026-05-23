export function getPreferredLanguage(): string {
  return getChromeLanguage() ?? getNavigatorLanguage() ?? "ja";
}

function getChromeLanguage(): string | undefined {
  if (typeof chrome === "undefined" || !chrome.i18n?.getUILanguage) {
    return undefined;
  }

  return chrome.i18n.getUILanguage();
}

function getNavigatorLanguage(): string | undefined {
  if (typeof navigator === "undefined") {
    return undefined;
  }

  return navigator.language;
}
