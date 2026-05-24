import "./styles.css";
import {
  createMemoryCard,
  getNextIndex,
  getPreviousIndex,
  updateMemoryCard,
  type MemoryCard
} from "./core/cards";
import { normalizeAppState, type AppState } from "./core/appState";
import {
  PREMIUM_PRICE_LABEL,
  STRIPE_PAYMENT_LINK,
  TRIAL_DAYS,
  calculatePremiumStatus
} from "./core/premium";
import { createTranslator, formatDate, formatNumber, formatRemainingDays, getLocale } from "./i18n";
import { getPreferredLanguage } from "./platform/language";
import { createAppStorage } from "./storage";

const storage = createAppStorage();
const locale = getLocale(getPreferredLanguage());
const t = createTranslator(locale);
const appRoot = document.querySelector<HTMLElement>("#app");

if (!appRoot) {
  throw new Error("App root was not found.");
}

const app = appRoot;
let state: AppState;
let showFirstRunGuide = false;
type FocusTarget =
  | "card-stage"
  | "previous-card"
  | "next-card"
  | `save-card-${number}`;

async function boot(): Promise<void> {
  document.documentElement.lang = locale;
  document.title = t("appTitle");
  renderLoading();
  const storedState = await storage.load();
  showFirstRunGuide = storedState === undefined;
  state = normalizeAppState(storedState);
  await storage.save(state);
  render();
}

function renderLoading(): void {
  app.textContent = "";

  const container = element("div", "shell shell-loading");
  const panel = element("section", "panel state-panel");
  panel.setAttribute("role", "status");
  panel.setAttribute("aria-busy", "true");
  panel.setAttribute("aria-live", "polite");
  panel.setAttribute("aria-atomic", "true");
  panel.setAttribute("aria-describedby", "loading-message");

  const title = element("h1");
  title.textContent = t("appTitle");
  const message = element("p", "state-message");
  message.id = "loading-message";
  message.textContent = t("loading");

  panel.append(title, message);
  container.append(panel);
  app.append(container);
}

function render(statusMessage = "", focusTarget?: FocusTarget): void {
  app.textContent = "";

  const currentCard = state.cards[state.currentIndex];
  const container = element("div", "shell");
  const content = [
    renderHeader(),
    ...(showFirstRunGuide ? [renderFirstRunGuide()] : []),
    ...(statusMessage ? [renderStatusBanner(statusMessage)] : []),
    currentCard ? renderCardStage(currentCard) : renderEmptyCardsPanel(),
    renderEditor(),
    renderPremiumPanel(),
    renderNotes()
  ];

  container.append(...content);

  app.append(container);
  restoreFocus(focusTarget);
}

function renderHeader(): HTMLElement {
  const header = element("header", "header");
  const title = element("h1");
  title.textContent = t("appTitle");
  const subtitle = element("p", "subtitle");
  subtitle.textContent = t("appSubtitle");
  header.append(title, subtitle);
  return header;
}

function renderFirstRunGuide(): HTMLElement {
  const guide = element("aside", "onboarding-guide");
  guide.setAttribute("aria-labelledby", "onboarding-title");

  const title = element("h2", "guide-title");
  title.id = "onboarding-title";
  title.textContent = t("onboardingTitle");

  const message = element("p");
  message.textContent = t("onboardingGuide");

  guide.append(title, message);
  return guide;
}

function renderStatusBanner(statusMessage: string): HTMLElement {
  const banner = element("aside", "status-banner");
  banner.setAttribute("role", "status");
  banner.setAttribute("aria-live", "polite");
  banner.setAttribute("aria-atomic", "true");
  banner.textContent = statusMessage;
  return banner;
}

function renderEmptyCardsPanel(): HTMLElement {
  const section = element("section", "card-stage empty-cards");
  section.id = "card-stage";
  section.setAttribute("aria-labelledby", "empty-cards-title");
  section.setAttribute("aria-describedby", "empty-cards-message empty-cards-next-step");

  const title = element("h2");
  title.id = "empty-cards-title";
  title.textContent = t("emptyCardsTitle");

  const message = element("p", "help-text");
  message.id = "empty-cards-message";
  message.textContent = t("emptyCardsMessage");

  const nextStep = element("p", "empty-cards-next-step");
  nextStep.id = "empty-cards-next-step";
  nextStep.textContent = t("emptyCardsNextStep");

  const add = button(t("emptyCardsAction"), "primary wide");
  add.addEventListener("click", handleAddCard);

  section.append(title, message, nextStep, add);
  return section;
}

function renderCardStage(card: MemoryCard): HTMLElement {
  const section = element("section", "card-stage");
  section.id = "card-stage";
  section.tabIndex = 0;
  section.dataset["focusKey"] = "card-stage";
  section.setAttribute("aria-labelledby", "card-stage-title");
  section.setAttribute("aria-describedby", "card-keyboard-hint current-card-count");
  section.setAttribute("aria-keyshortcuts", "ArrowLeft ArrowRight");
  section.addEventListener("keydown", handleCardStageKeydown);

  const title = element("h2", "sr-only");
  title.id = "card-stage-title";
  title.textContent = t("cardStageTitle");

  const cardPanel = element("article", "memory-card");
  cardPanel.id = "current-card";
  cardPanel.setAttribute("aria-labelledby", "current-card-phrase");
  cardPanel.setAttribute("aria-describedby", "current-card-count");
  cardPanel.setAttribute("aria-live", "polite");
  cardPanel.setAttribute("aria-atomic", "true");
  const emoji = element("div", "memory-emoji");
  emoji.setAttribute("aria-hidden", "true");
  emoji.textContent = card.emoji;
  const phrase = element("p", "memory-phrase");
  phrase.id = "current-card-phrase";
  phrase.textContent = card.phrase;
  cardPanel.append(emoji, phrase);

  const controls = element("div", "controls");
  const previous = button(t("previous"), "secondary");
  previous.dataset["focusKey"] = "previous-card";
  previous.setAttribute("aria-label", t("previousCardAriaLabel"));
  previous.setAttribute("aria-controls", "current-card");
  previous.addEventListener("click", () => {
    state.currentIndex = getPreviousIndex(state.currentIndex, state.cards.length);
    void saveAndRender("", "previous-card");
  });

  const count = element("span", "card-count");
  count.id = "current-card-count";
  count.setAttribute("aria-live", "polite");
  count.setAttribute("aria-atomic", "true");
  count.textContent = t("cardCount", {
    current: state.currentIndex + 1,
    total: state.cards.length
  });

  const next = button(t("next"), "primary");
  next.dataset["focusKey"] = "next-card";
  next.setAttribute("aria-label", t("nextCardAriaLabel"));
  next.setAttribute("aria-controls", "current-card");
  next.addEventListener("click", () => {
    state.currentIndex = getNextIndex(state.currentIndex, state.cards.length);
    void saveAndRender("", "next-card");
  });

  const keyboardHint = element("p", "keyboard-hint");
  keyboardHint.id = "card-keyboard-hint";
  keyboardHint.textContent = t("cardKeyboardHint");

  controls.append(previous, count, next);
  section.append(title, cardPanel, controls, keyboardHint);
  return section;
}

function handleCardStageKeydown(event: KeyboardEvent): void {
  if (event.target !== event.currentTarget || event.altKey || event.ctrlKey || event.metaKey) {
    return;
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    state.currentIndex = getPreviousIndex(state.currentIndex, state.cards.length);
    void saveAndRender("", "card-stage");
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    state.currentIndex = getNextIndex(state.currentIndex, state.cards.length);
    void saveAndRender("", "card-stage");
  }
}

function renderEditor(): HTMLElement {
  const section = element("section", "panel editor");
  section.setAttribute("aria-labelledby", "editor-title");
  section.setAttribute("aria-describedby", "editor-help");

  const title = element("h2");
  title.id = "editor-title";
  title.textContent = t("editorTitle");
  const help = element("p", "help-text");
  help.id = "editor-help";
  help.textContent = t("editorHelp");
  const list = element("div", "editor-list");

  if (state.cards.length === 0) {
    list.append(renderEditorEmptyState());
  } else {
    state.cards.forEach((card, index) => {
      list.append(renderCardEditor(card, index));
    });
  }

  const add = button(t("addCard"), "primary wide");
  add.addEventListener("click", handleAddCard);

  section.append(title, help, list, add);
  return section;
}

function renderEditorEmptyState(): HTMLElement {
  const message = element("p", "empty-editor-message");
  message.textContent = t("emptyEditorMessage");
  return message;
}

function renderCardEditor(card: MemoryCard, index: number): HTMLElement {
  const row = element("form", "editor-row");
  const displayIndex = formatNumber(locale, index + 1);
  const rowTitleId = `card-editor-title-${index}`;
  row.setAttribute("aria-labelledby", rowTitleId);

  const rowTitle = element("h3", "sr-only");
  rowTitle.id = rowTitleId;
  rowTitle.textContent = t("cardEditorAriaLabel", { index: displayIndex });

  const emojiInput = input(`card-${index}-emoji`, card.emoji, 4);
  emojiInput.classList.add("emoji-input");
  const phraseInput = input(`card-${index}-phrase`, card.phrase, 48);

  const save = button(t("saveCard"), "primary", "submit");
  save.dataset["focusKey"] = saveCardFocusKey(index);
  save.setAttribute("aria-label", t("saveCardAriaLabel", { index: displayIndex }));
  const remove = button(t("deleteCard"), "danger", "button");
  remove.setAttribute("aria-label", t("deleteCardAriaLabel", { index: displayIndex }));
  remove.disabled = state.cards.length <= 1;
  if (remove.disabled) {
    remove.setAttribute("aria-label", t("deleteCardDisabledAriaLabel", { index: displayIndex }));
  }

  row.addEventListener("submit", (event) => {
    event.preventDefault();
    state.cards = state.cards.map((existing) =>
      existing.id === card.id
        ? updateMemoryCard(existing, {
            emoji: emojiInput.value,
            phrase: phraseInput.value
          })
        : existing
    );
    state.currentIndex = index;
    void saveAndRender(t("saved"), saveCardFocusKey(index));
  });

  remove.addEventListener("click", () => {
    if (state.cards.length <= 1) {
      render(t("cannotDeleteLast"));
      return;
    }

    state.cards = state.cards.filter((existing) => existing.id !== card.id);
    state.currentIndex = Math.min(state.currentIndex, state.cards.length - 1);
    const nextFocusIndex = Math.min(index, state.cards.length - 1);
    void saveAndRender(t("saved"), saveCardFocusKey(nextFocusIndex));
  });

  row.append(
    rowTitle,
    labeledField(t("emojiLabel"), emojiInput),
    labeledField(t("phraseLabel"), phraseInput),
    save,
    remove
  );

  return row;
}

function renderPremiumPanel(): HTMLElement {
  const section = element("section", "panel premium");
  section.setAttribute("aria-labelledby", "premium-title");

  const title = element("h2");
  title.id = "premium-title";
  title.textContent = t("premiumTitle");

  const description = element("p", "help-text");
  description.textContent = t("premiumDescription", {
    price: PREMIUM_PRICE_LABEL,
    trialDays: TRIAL_DAYS
  });

  const status = calculatePremiumStatus(state.firstStartedAt, state.premiumPurchased);
  const statusLine = element("p", "premium-status");
  if (status.isPremiumActive) {
    statusLine.textContent = state.premiumPurchased
      ? t("premiumPurchased")
      : t("premiumActiveTrial", {
          days: formatRemainingDays(locale, status.trialDaysRemaining),
          endsAt: formatDate(locale, status.trialEndsAt)
        });
  } else {
    statusLine.textContent = t("premiumExpired");
  }

  const payment = element("p", "payment-placeholder");
  payment.textContent = `${t("paymentPlaceholder")} (${STRIPE_PAYMENT_LINK})`;

  section.append(title, description, statusLine, payment);
  return section;
}

function renderNotes(): HTMLElement {
  const footer = element("footer", "notes");
  const privacy = element("p");
  privacy.textContent = t("privacyNote");
  const nonMedical = element("p");
  nonMedical.textContent = t("nonMedicalNote");

  footer.append(privacy, nonMedical);
  return footer;
}

async function saveAndRender(statusMessage = "", focusTarget?: FocusTarget): Promise<void> {
  await storage.save(state);
  render(statusMessage, focusTarget);
}

function addNewCard(): void {
  state.cards = [
    ...state.cards,
    createMemoryCard({
      emoji: t("addEmojiDefault"),
      phrase: t("addPhraseDefault")
    })
  ];
  state.currentIndex = state.cards.length - 1;
}

function handleAddCard(): void {
  addNewCard();
  void saveAndRender(t("saved"), "card-stage");
}

function restoreFocus(focusTarget?: FocusTarget): void {
  if (!focusTarget) {
    return;
  }

  const target = app.querySelector<HTMLElement>(`[data-focus-key="${focusTarget}"]`);
  target?.focus({ preventScroll: true });
}

function saveCardFocusKey(index: number): `save-card-${number}` {
  return `save-card-${index}`;
}

function labeledField(labelText: string, control: HTMLInputElement): HTMLElement {
  const label = element("label", "field");
  label.htmlFor = control.id;
  const span = element("span");
  span.textContent = labelText;
  label.append(span, control);
  return label;
}

function input(id: string, value: string, maxLength: number): HTMLInputElement {
  const control = document.createElement("input");
  control.id = id;
  control.type = "text";
  control.value = value;
  control.maxLength = maxLength;
  control.autocomplete = "off";
  return control;
}

function button(
  label: string,
  className: string,
  type: "button" | "submit" = "button"
): HTMLButtonElement {
  const control = document.createElement("button");
  control.type = type;
  control.className = `button ${className}`;
  control.textContent = label;
  return control;
}

function element<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  className = ""
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tagName);
  if (className) {
    node.className = className;
  }
  return node;
}

void boot();
