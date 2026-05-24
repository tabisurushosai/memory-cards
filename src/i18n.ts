export type Locale = "ja" | "en";

type LocalizedCardDraft = {
  readonly emoji: string;
  readonly phrase: string;
};

const messages = {
  ja: {
    appTitle: "おもいでカード",
    appSubtitle: "絵文字と短い言葉のカードをめくり、会話のきっかけを作ります。",
    onboardingTitle: "はじめての方へ",
    onboardingGuide:
      "まずは表示中のカードを一緒に読み、必要に応じて下の編集欄で家族の思い出に合う言葉へ直して保存してください。",
    cardStageTitle: "カード表示",
    cardKeyboardHint: "カード表示にフォーカスがあるときは、左右の矢印キーでも前後のカードへ移動できます。",
    emptyCardsTitle: "最初のカードを作りましょう",
    emptyCardsMessage:
      "カードがない場合も、下のボタンからすぐに1枚目を用意できます。絵文字1つと短い言葉だけで大丈夫です。",
    emptyCardsNextStep: "追加すると、この場所に大きなカードとして表示されます。",
    emptyCardsAction: "最初のカードを追加",
    previous: "前へ",
    next: "次へ",
    previousCardAriaLabel: "前のカードを表示",
    nextCardAriaLabel: "次のカードを表示",
    cardCount: "全{total}枚中{current}枚目",
    editorTitle: "家族用カードの編集",
    editorHelp: "思い出しやすい絵文字と短い言葉を入力してください。",
    emptyEditorMessage: "カードはまだありません。下のボタンから最初のカードを追加してください。",
    cardEditorAriaLabel: "{index}枚目のカード編集",
    emojiLabel: "絵文字",
    phraseLabel: "短い言葉",
    saveCard: "保存",
    saveCardAriaLabel: "{index}枚目のカードを保存",
    deleteCard: "削除",
    deleteCardAriaLabel: "{index}枚目のカードを削除",
    deleteCardDisabledAriaLabel: "{index}枚目のカードは最後の1枚なので削除できません",
    addCard: "カードを追加",
    addEmojiDefault: "📷",
    addPhraseDefault: "写真を見た日のこと",
    emptyPhraseFallback: "思い出のこと",
    loading: "カードを読み込んでいます...",
    saved: "保存しました。",
    cannotDeleteLast: "カードは1枚以上残してください。",
    premiumTitle: "Premium",
    premiumDescription:
      "Premiumは{price}の買い切りで提供予定です。現在は、この端末内で{trialDays}日間のトライアルを管理します。",
    premiumActiveTrial: "トライアル中：{endsAt}まで、残り{days}",
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
      "Start by reading the card together, then use the editor below to save a phrase that fits your family's memories.",
    cardStageTitle: "Card display",
    cardKeyboardHint: "When the card display is focused, use the Left and Right Arrow keys to move to the previous or next card.",
    emptyCardsTitle: "Create your first card",
    emptyCardsMessage:
      "When there are no cards, use the button below to add the first one right away. One emoji and a short phrase are enough.",
    emptyCardsNextStep: "After you add it, the card appears here in large type.",
    emptyCardsAction: "Add the first card",
    previous: "Previous",
    next: "Next",
    previousCardAriaLabel: "Show previous card",
    nextCardAriaLabel: "Show next card",
    cardCount: "Card {current} of {total}",
    editorTitle: "Family card editor",
    editorHelp: "Enter an easy-to-recognize emoji and a short phrase.",
    emptyEditorMessage: "No cards yet. Use the button below to add the first card.",
    cardEditorAriaLabel: "Edit card {index}",
    emojiLabel: "Emoji",
    phraseLabel: "Short phrase",
    saveCard: "Save",
    saveCardAriaLabel: "Save card {index}",
    deleteCard: "Delete",
    deleteCardAriaLabel: "Delete card {index}",
    deleteCardDisabledAriaLabel: "Card {index} cannot be deleted because it is the last card",
    addCard: "Add card",
    addEmojiDefault: "📷",
    addPhraseDefault: "The day we looked at photos",
    emptyPhraseFallback: "A memory to share",
    loading: "Loading cards...",
    saved: "Saved.",
    cannotDeleteLast: "At least one card must remain.",
    premiumTitle: "Premium",
    premiumDescription:
      "Premium is planned as a one-time {price} purchase. For now, the {trialDays}-day trial is tracked locally on this device.",
    premiumActiveTrial: "Trial active: {days} remaining, ending {endsAt}",
    premiumExpired: "The trial has ended. Basic features continue to work.",
    premiumPurchased: "Premium is active.",
    paymentPlaceholder: "The payment link will be added before publishing.",
    privacyNote: "Your cards are stored in this browser's local storage and are never sent outside the device.",
    nonMedicalNote: "This extension is for conversation prompts only. It does not provide diagnosis, treatment, or medical advice."
  }
} as const;

const defaultCardDrafts: Record<Locale, readonly LocalizedCardDraft[]> = {
  ja: [
    { emoji: "🌸", phrase: "春に見た花のこと" },
    { emoji: "🍙", phrase: "好きだったお弁当" },
    { emoji: "🚃", phrase: "よく出かけた場所" }
  ],
  en: [
    { emoji: "🌸", phrase: "Flowers we saw in spring" },
    { emoji: "🍙", phrase: "A favorite packed lunch" },
    { emoji: "🚃", phrase: "A place we often visited" }
  ]
};

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

export function getDefaultCardDrafts(locale: Locale): readonly LocalizedCardDraft[] {
  return defaultCardDrafts[locale];
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

  return `${formattedDays} ${new Intl.PluralRules(localeTags[locale]).select(days) === "one" ? "day" : "days"}`;
}
