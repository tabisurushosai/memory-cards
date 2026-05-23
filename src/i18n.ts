export type Locale = "ja" | "en";

const messages = {
  ja: {
    appTitle: "おもいでカード",
    appSubtitle: "絵文字と短い言葉のカードをめくり、会話のきっかけにします。",
    cardStageTitle: "カード表示",
    cardKeyboardHint: "カード表示にフォーカスしているときは、左右の矢印キーでもカードをめくれます。",
    previous: "前へ",
    next: "次へ",
    cardCount: "全{total}枚中 {current}枚目",
    editorTitle: "家族用カード編集",
    editorHelp: "思い出しやすい絵文字と短い言葉を入力してください。",
    emojiLabel: "絵文字",
    phraseLabel: "短い言葉",
    saveCard: "保存",
    deleteCard: "削除",
    addCard: "カードを追加",
    addEmojiDefault: "📷",
    addPhraseDefault: "写真を見た日のこと",
    loading: "カードを読み込んでいます...",
    saved: "保存しました。",
    cannotDeleteLast: "カードは1枚以上残してください。",
    premiumTitle: "Premium",
    premiumDescription:
      "Premium は {price} の買い切り予定です。現在は、この端末内で{trialDays}日間のトライアル期間を判定します。",
    premiumActiveTrial: "トライアル中: 残り{days}（{endsAt}まで）",
    premiumExpired: "トライアルは終了しました。基本機能は引き続き使えます。",
    premiumPurchased: "Premium が有効です。",
    paymentPlaceholder: "支払いリンクは公開前に STRIPE_PAYMENT_LINK から差し替える予定です。",
    privacyNote: "データはこのブラウザのローカル保存領域に保存され、外部へ送信されません。",
    nonMedicalNote: "この拡張機能は会話のきっかけ用です。診断・治療・医療助言は行いません。"
  },
  en: {
    appTitle: "Memory Cards",
    appSubtitle: "Flip through cards with an emoji and a short phrase to prompt conversation.",
    cardStageTitle: "Card display",
    cardKeyboardHint: "When the card display is focused, use the Left and Right Arrow keys to move between cards.",
    previous: "Previous",
    next: "Next",
    cardCount: "Card {current} of {total}",
    editorTitle: "Family card editor",
    editorHelp: "Add an easy-to-recognize emoji and a short phrase.",
    emojiLabel: "Emoji",
    phraseLabel: "Short phrase",
    saveCard: "Save",
    deleteCard: "Delete",
    addCard: "Add card",
    addEmojiDefault: "📷",
    addPhraseDefault: "The day we looked at photos",
    loading: "Loading cards...",
    saved: "Saved.",
    cannotDeleteLast: "Keep at least one card.",
    premiumTitle: "Premium",
    premiumDescription:
      "Premium is planned as a one-time {price} purchase. This device currently tracks a {trialDays}-day trial locally.",
    premiumActiveTrial: "Trial active: {days} left (until {endsAt})",
    premiumExpired: "The trial has ended. Basic features continue to work.",
    premiumPurchased: "Premium is active.",
    paymentPlaceholder: "The payment link placeholder will be replaced before publishing.",
    privacyNote: "Your cards are stored in this browser's local storage and are not sent outside.",
    nonMedicalNote: "This extension prompts conversation. It does not provide diagnosis, treatment, or medical advice."
  }
} as const;

export type MessageKey = keyof typeof messages.ja;
export type Translator = (key: MessageKey, replacements?: Record<string, string | number>) => string;

const localeTags: Record<Locale, string> = {
  ja: "ja-JP",
  en: "en-US"
};

export function getLocale(language = "ja"): Locale {
  return language.toLowerCase().startsWith("en") ? "en" : "ja";
}

export function createTranslator(locale: Locale): Translator {
  return (key, replacements = {}) => {
    const template = String(messages[locale][key]);

    return Object.entries(replacements).reduce(
      (text, [name, value]) =>
        text.replaceAll(`{${name}}`, typeof value === "number" ? formatNumber(locale, value) : value),
      template
    );
  };
}

export function formatNumber(locale: Locale, value: number): string {
  return new Intl.NumberFormat(localeTags[locale], {
    maximumFractionDigits: 0
  }).format(value);
}

export function formatDate(locale: Locale, isoDate: string): string {
  return new Intl.DateTimeFormat(localeTags[locale], {
    dateStyle: "medium"
  }).format(new Date(isoDate));
}

export function formatRemainingDays(locale: Locale, days: number): string {
  const formattedDays = formatNumber(locale, days);

  if (locale === "ja") {
    return `${formattedDays}日`;
  }

  return `${formattedDays} ${days === 1 ? "day" : "days"}`;
}
