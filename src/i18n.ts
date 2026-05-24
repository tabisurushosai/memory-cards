import { DEFAULT_CARD_DRAFTS, type DraftMemoryCard } from "./core/cards";

export type Locale = "ja" | "en";

const messages = {
  ja: {
    appTitle: "おもいでカード",
    appSubtitle: "絵文字と短い言葉のカードをめくって、会話のきっかけを作ります。",
    onboardingTitle: "はじめての方へ",
    onboardingGuide:
      "最初は画面上のカードを1枚読むところから始め、合わない言葉は下の編集欄で直して保存してください。",
    cardStageTitle: "カード表示",
    cardKeyboardHint: "カード表示にフォーカスがあるときは、左右の矢印キーでも前後のカードに移動できます。",
    emptyCardsTitle: "カードがまだありません",
    emptyCardsMessage:
      "会話のきっかけは、絵文字1つと短い言葉から始められます。",
    emptyCardsNextStep: "最初のカードを追加すると、ここに大きく表示され、すぐ編集できます。",
    emptyCardsAction: "最初のカードを追加",
    previous: "前へ",
    next: "次へ",
    cardNavigationAriaLabel: "カードの移動操作",
    previousCardAriaLabel: "前のカードを表示",
    nextCardAriaLabel: "次のカードを表示",
    cardCount: "{total}枚中{current}枚目",
    editorTitle: "家族向けカード編集",
    editorHelp: "思い出を話しやすい絵文字と短い言葉を入力してください。",
    emptyEditorMessage: "まずは最初のカードを追加してください。追加後に絵文字と言葉を直せます。",
    cardEditorAriaLabel: "{index}枚目のカード編集",
    emojiLabel: "絵文字",
    phraseLabel: "短い言葉",
    emojiInputAriaLabel: "{index}枚目のカードの絵文字",
    phraseInputAriaLabel: "{index}枚目のカードの短い言葉",
    saveCard: "保存",
    saveCardAriaLabel: "{index}枚目のカードを保存",
    deleteCard: "削除",
    deleteCardAriaLabel: "{index}枚目のカードを削除",
    deleteCardDisabledAriaLabel: "{index}枚目のカードは最後の1枚なので削除できません",
    addCard: "カードを追加",
    addEmojiDefault: "📷",
    addPhraseDefault: "写真を見た日のこと",
    emptyPhraseFallback: "思い出のこと",
    loading: "カードを読み込んでいます…",
    saved: "保存しました。",
    cannotDeleteLast: "カードは1枚以上残してください。",
    premiumTitle: "Premium",
    premiumDescription:
      "Premiumは{price}の買い切りで提供予定です。現在は、この端末内で{trialDays}日間のトライアルを管理します。",
    premiumActiveTrial: "トライアル中: {endsAt}まで (残り{days})",
    premiumExpired: "トライアルは終了しました。基本機能は引き続き使えます。",
    premiumPurchased: "Premium が有効です。",
    paymentPlaceholder: "支払いリンクは公開前に差し替えます。",
    privacyNote: "カードのデータはこのブラウザのローカル保存領域に保存され、外部には送信されません。",
    nonMedicalNote: "この拡張機能は会話のきっかけを作るためのものです。診断・治療・医療助言は行いません。"
  },
  en: {
    appTitle: "Memory Cards",
    appSubtitle: "Flip through cards with an emoji and a short phrase to start a conversation.",
    onboardingTitle: "First time here?",
    onboardingGuide:
      "Start by reading one card together, then update any wording in the editor below and save it.",
    cardStageTitle: "Card display",
    cardKeyboardHint: "When the card display is focused, use the Left and Right Arrow keys to move between cards.",
    emptyCardsTitle: "No cards yet",
    emptyCardsMessage:
      "A conversation prompt can start with one emoji and one short phrase.",
    emptyCardsNextStep: "Add the first card to show it here in large type and edit it right away.",
    emptyCardsAction: "Add the first card",
    previous: "Previous",
    next: "Next",
    cardNavigationAriaLabel: "Card navigation controls",
    previousCardAriaLabel: "Show previous card",
    nextCardAriaLabel: "Show next card",
    cardCount: "Card {current} of {total}",
    editorTitle: "Edit family cards",
    editorHelp: "Enter an easy-to-recognize emoji and a short phrase that is easy to talk about.",
    emptyEditorMessage: "Add the first card, then adjust the emoji and phrase after it appears.",
    cardEditorAriaLabel: "Edit card {index}",
    emojiLabel: "Emoji",
    phraseLabel: "Short phrase",
    emojiInputAriaLabel: "Emoji for card {index}",
    phraseInputAriaLabel: "Short phrase for card {index}",
    saveCard: "Save",
    saveCardAriaLabel: "Save card {index}",
    deleteCard: "Delete",
    deleteCardAriaLabel: "Delete card {index}",
    deleteCardDisabledAriaLabel: "Card {index} cannot be deleted because it is the last remaining card",
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
    premiumActiveTrial: "Trial active: {days} remaining (ends {endsAt})",
    premiumExpired: "The trial has ended. Basic features continue to work.",
    premiumPurchased: "Premium is active.",
    paymentPlaceholder: "The payment link will be added before publishing.",
    privacyNote: "Your cards are stored in this browser's local storage and are never sent outside the device.",
    nonMedicalNote: "This extension is for conversation prompts only. It does not provide diagnosis, treatment, or medical advice."
  }
} as const;

const defaultCardDrafts = {
  ja: DEFAULT_CARD_DRAFTS,
  en: [
    { emoji: "🌸", phrase: "Flowers we saw in spring" },
    { emoji: "🍙", phrase: "A favorite packed lunch" },
    { emoji: "🚃", phrase: "A place we often visited" }
  ]
} satisfies Record<Locale, readonly DraftMemoryCard[]>;

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

export function getDefaultCardDrafts(locale: Locale): readonly DraftMemoryCard[] {
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
