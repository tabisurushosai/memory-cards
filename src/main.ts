import "./styles.css";
import {
  MemoryCard,
  createMemoryCard,
  getNextIndex,
  getPreviousIndex,
  updateMemoryCard
} from "./core/cards";
import { AppState, normalizeAppState } from "./core/appState";
import {
  PREMIUM_PRICE_LABEL,
  STRIPE_PAYMENT_LINK,
  calculatePremiumStatus
} from "./core/premium";
import { createAppStorage } from "./storage";
import { getLocale, t } from "./i18n";

const storage = createAppStorage();
const appRoot = document.querySelector<HTMLElement>("#app");

if (!appRoot) {
  throw new Error("App root was not found.");
}

const app = appRoot;
let state: AppState;

async function boot(): Promise<void> {
  renderLoading();
  state = normalizeAppState(await storage.load());
  document.documentElement.lang = getLocale();
  await storage.save(state);
  render();
}

function renderLoading(): void {
  app.textContent = "";

  const container = element("div", "shell shell-loading");
  const panel = element("section", "panel state-panel");
  panel.setAttribute("aria-busy", "true");

  const title = element("h1");
  title.textContent = t("appTitle");
  const message = element("p", "state-message");
  message.textContent = t("loading");

  panel.append(title, message);
  container.append(panel);
  app.append(container);
}

function render(statusMessage = ""): void {
  app.textContent = "";

  const currentCard = state.cards[state.currentIndex];
  const container = element("div", "shell");

  container.append(
    renderHeader(),
    renderCardStage(currentCard),
    renderEditor(),
    renderPremiumPanel(),
    renderNotes(statusMessage)
  );

  app.append(container);
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

function renderCardStage(card: MemoryCard): HTMLElement {
  const section = element("section", "card-stage");
  section.setAttribute("aria-label", t("appTitle"));

  const cardPanel = element("div", "memory-card");
  const emoji = element("div", "memory-emoji");
  emoji.textContent = card.emoji;
  const phrase = element("p", "memory-phrase");
  phrase.textContent = card.phrase;
  cardPanel.append(emoji, phrase);

  const controls = element("div", "controls");
  const previous = button(t("previous"), "secondary");
  previous.addEventListener("click", () => {
    state.currentIndex = getPreviousIndex(state.currentIndex, state.cards.length);
    void saveAndRender();
  });

  const count = element("span", "card-count");
  count.textContent = t("cardCount", {
    current: state.currentIndex + 1,
    total: state.cards.length
  });

  const next = button(t("next"), "primary");
  next.addEventListener("click", () => {
    state.currentIndex = getNextIndex(state.currentIndex, state.cards.length);
    void saveAndRender();
  });

  controls.append(previous, count, next);
  section.append(cardPanel, controls);
  return section;
}

function renderEditor(): HTMLElement {
  const section = element("section", "panel editor");
  section.setAttribute("aria-labelledby", "editor-title");

  const title = element("h2");
  title.id = "editor-title";
  title.textContent = t("editorTitle");
  const help = element("p", "help-text");
  help.textContent = t("editorHelp");
  const list = element("div", "editor-list");

  state.cards.forEach((card, index) => {
    list.append(renderCardEditor(card, index));
  });

  const add = button(t("addCard"), "primary wide");
  add.addEventListener("click", () => {
    state.cards = [
      ...state.cards,
      createMemoryCard({
        emoji: t("addEmojiDefault"),
        phrase: t("addPhraseDefault")
      })
    ];
    state.currentIndex = state.cards.length - 1;
    void saveAndRender(t("saved"));
  });

  section.append(title, help, list, add);
  return section;
}

function renderCardEditor(card: MemoryCard, index: number): HTMLElement {
  const row = element("form", "editor-row");
  row.setAttribute("aria-label", `${t("editorTitle")} ${index + 1}`);

  const emojiInput = input(`${t("emojiLabel")} ${index + 1}`, card.emoji, 4);
  emojiInput.classList.add("emoji-input");
  const phraseInput = input(`${t("phraseLabel")} ${index + 1}`, card.phrase, 48);

  const save = button(t("saveCard"), "primary", "submit");
  const remove = button(t("deleteCard"), "danger", "button");
  remove.disabled = state.cards.length <= 1;

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
    void saveAndRender(t("saved"));
  });

  remove.addEventListener("click", () => {
    if (state.cards.length <= 1) {
      render(t("cannotDeleteLast"));
      return;
    }

    state.cards = state.cards.filter((existing) => existing.id !== card.id);
    state.currentIndex = Math.min(state.currentIndex, state.cards.length - 1);
    void saveAndRender(t("saved"));
  });

  row.append(
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
  description.textContent = t("premiumDescription").replace("$3", PREMIUM_PRICE_LABEL);

  const status = calculatePremiumStatus(state.firstStartedAt, state.premiumPurchased);
  const statusLine = element("p", "premium-status");
  if (state.premiumPurchased) {
    statusLine.textContent = t("premiumPurchased");
  } else if (status.isTrialActive) {
    statusLine.textContent = t("premiumActiveTrial", { days: status.trialDaysRemaining });
  } else {
    statusLine.textContent = t("premiumExpired");
  }

  const payment = element("p", "payment-placeholder");
  payment.textContent = `${t("paymentPlaceholder")} (${STRIPE_PAYMENT_LINK})`;

  section.append(title, description, statusLine, payment);
  return section;
}

function renderNotes(statusMessage: string): HTMLElement {
  const footer = element("footer", "notes");
  if (statusMessage) {
    const status = element("p", "status-message");
    status.setAttribute("role", "status");
    status.textContent = statusMessage;
    footer.append(status);
  }

  const privacy = element("p");
  privacy.textContent = t("privacyNote");
  const nonMedical = element("p");
  nonMedical.textContent = t("nonMedicalNote");

  footer.append(privacy, nonMedical);
  return footer;
}

async function saveAndRender(statusMessage = ""): Promise<void> {
  await storage.save(state);
  render(statusMessage);
}

function labeledField(labelText: string, control: HTMLInputElement): HTMLElement {
  const label = element("label", "field");
  const span = element("span");
  span.textContent = labelText;
  label.append(span, control);
  return label;
}

function input(label: string, value: string, maxLength: number): HTMLInputElement {
  const control = document.createElement("input");
  control.type = "text";
  control.value = value;
  control.maxLength = maxLength;
  control.setAttribute("aria-label", label);
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
