type Locale = "ja" | "en";

const messages = {
  ja: {
    appTitle: "おもいでカード",
    appSubtitle: "絵文字と短い言葉をめくって、会話のきっかけにします。",
    previous: "前へ",
    next: "次へ",
    cardCount: "{current} / {total}",
    editorTitle: "家族用カード編集",
    editorHelp: "思い出しやすい絵文字と、短い言葉を入れてください。",
    emojiLabel: "絵文字",
    phraseLabel: "短い言葉",
    saveCard: "保存",
    deleteCard: "削除",
    addCard: "カードを追加",
    addEmojiDefault: "📷",
    addPhraseDefault: "写真を見た日のこと",
    saved: "保存しました",
    cannotDeleteLast: "カードは1枚以上必要です",
    premiumTitle: "Premium",
    premiumDescription:
      "Premium は $3 の買い切り予定です。現在は7日トライアル状態をこの端末内で判定します。",
    premiumActiveTrial: "トライアル中: 残り {days} 日",
    premiumExpired: "トライアルは終了しています。基本機能はそのまま使えます。",
    premiumPurchased: "Premium 有効",
    paymentPlaceholder: "支払いリンクは公開前に STRIPE_PAYMENT_LINK を差し替えます。",
    privacyNote: "データはこのブラウザの storage に保存され、外部送信しません。",
    nonMedicalNote: "本拡張は会話のきっかけ用です。診断・治療・医療助言は行いません。"
  },
  en: {
    appTitle: "Memory Cards",
    appSubtitle: "Flip through emoji and short-phrase cards to prompt conversation.",
    previous: "Previous",
    next: "Next",
    cardCount: "{current} / {total}",
    editorTitle: "Family card editor",
    editorHelp: "Add an easy-to-recognize emoji and a short phrase.",
    emojiLabel: "Emoji",
    phraseLabel: "Short phrase",
    saveCard: "Save",
    deleteCard: "Delete",
    addCard: "Add card",
    addEmojiDefault: "📷",
    addPhraseDefault: "The day we looked at photos",
    saved: "Saved",
    cannotDeleteLast: "At least one card is required",
    premiumTitle: "Premium",
    premiumDescription:
      "Premium is planned as a one-time $3 purchase. This device currently calculates a 7-day trial.",
    premiumActiveTrial: "Trial active: {days} day(s) left",
    premiumExpired: "The trial has ended. Basic features continue to work.",
    premiumPurchased: "Premium active",
    paymentPlaceholder: "Replace STRIPE_PAYMENT_LINK before publishing the payment link.",
    privacyNote: "Data is stored in this browser's storage and is not sent outside.",
    nonMedicalNote: "This extension prompts conversation. It does not provide diagnosis, treatment, or medical advice."
  }
} as const;

export type MessageKey = keyof typeof messages.ja;

export function getLocale(): Locale {
  const language = getChromeLanguage() ?? navigator.language;
  return language.toLowerCase().startsWith("en") ? "en" : "ja";
}

export function t(key: MessageKey, replacements: Record<string, string | number> = {}): string {
  const template = messages[getLocale()][key];

  return Object.entries(replacements).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    template
  );
}

function getChromeLanguage(): string | undefined {
  if (typeof chrome === "undefined" || !chrome.i18n?.getUILanguage) {
    return undefined;
  }

  return chrome.i18n.getUILanguage();
}
