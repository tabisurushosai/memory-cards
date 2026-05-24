export type Locale = "ja" | "en";

const messages = {
  ja: {
    appTitle: "おもいでカード",
    appSubtitle: "絵文字と短い言葉のカードをめくって、会話のきっかけを作ります。",
    onboardingTitle: "はじめての方へ",
    onboardingGuide:
      "まずはカードを1枚めくります。しっくりこないときは、下の編集欄で家族の思い出に近い言葉へ変えてください。",
    cardStageTitle: "カード表示",
    cardKeyboardHint: "カード表示にフォーカスしているときは、左右の矢印キーでも前後のカードへ移動できます。",
    emptyCardsTitle: "まだカードがありません",
    emptyCardsMessage:
      "最初のカードを追加すると、ここに大きく表示されます。絵文字と短い言葉だけで始められます。",
    emptyCardsAction: "最初のカードを追加",
    previous: "前へ",
    next: "次へ",
    previousCardAriaLabel: "前のカードを表示",
    nextCardAriaLabel: "次のカードを表示",
    cardCount: "全{total}枚中{current}枚目",
    editorTitle: "家族用カードの編集",
    editorHelp: "思い出しやすい絵文字と短い言葉を入力してください。",
    emptyEditorMessage: "カードはまだありません。下のボタンから最初のカードを追加してください。",
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
      "Premium は {price} の買い切りで提供予定です。現在は、この端末内で{trialDays}日間のトライアルを管理します。",
    premiumActiveTrial: "トライアル中：残り{days}（{endsAt}まで）",
    premiumExpired: "トライアルは終了しました。基本機能は引き続き使えます。",
    premiumPurchased: "Premium が有効です。",
    paymentPlaceholder: "支払いリンクは公開前に差し替えます。",
    privacyNote: "カードのデータはこのブラウザのローカル保存領域に保存され、外部へ送信されません。",
    nonMedicalNote: "この拡張機能は会話のきっかけを作るためのものです。診断・治療・医療助言は行いません。"
  },
  en: {
    appTitle: "Memory Cards",
    appSubtitle: "Flip cards with an emoji and a short phrase to start a conversation.",
    onboardingTitle: "First time here?",
    onboardingGuide:
      "Start by flipping one card. If it does not fit, use the editor below to make the phrase closer to a family memory.",
    cardStageTitle: "Card display",
    cardKeyboardHint: "When the card display is focused, use the Left and Right Arrow keys to move to the previous or next card.",
    emptyCardsTitle: "No cards yet",
    emptyCardsMessage:
      "After you add the first card, it will appear here in large type. An emoji and a short phrase are enough to begin.",
    emptyCardsAction: "Add the first card",
    previous: "Previous",
    next: "Next",
    previousCardAriaLabel: "Show previous card",
    nextCardAriaLabel: "Show next card",
    cardCount: "Card {current} of {total}",
    editorTitle: "Family card editor",
    editorHelp: "Enter an easy-to-recognize emoji and a short phrase.",
    emptyEditorMessage: "No cards yet. Use the button below to add the first card.",
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
      "Premium is planned as a one-time {price} purchase. For now, this device tracks a {trialDays}-day trial locally.",
    premiumActiveTrial: "Trial active: {days} left (until {endsAt})",
    premiumExpired: "The trial has ended. Basic features continue to work.",
    premiumPurchased: "Premium is active.",
    paymentPlaceholder: "The payment link will be added before publishing.",
    privacyNote: "Your cards are stored in this browser's local storage and are never sent outside the device.",
    nonMedicalNote: "This extension is for conversation prompts only. It does not provide diagnosis, treatment, or medical advice."
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
  const options: Intl.DateTimeFormatOptions =
    locale === "ja"
      ? {
          year: "numeric",
          month: "long",
          day: "numeric"
        }
      : {
          dateStyle: "medium"
        };

  return new Intl.DateTimeFormat(localeTags[locale], options).format(new Date(isoDate));
}

export function formatRemainingDays(locale: Locale, days: number): string {
  const formattedDays = formatNumber(locale, days);

  if (locale === "ja") {
    return `${formattedDays}日`;
  }

  return `${formattedDays} ${days === 1 ? "day" : "days"}`;
}
