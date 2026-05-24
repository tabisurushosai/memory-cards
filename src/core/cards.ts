export interface MemoryCard {
  readonly id: string;
  readonly emoji: string;
  readonly phrase: string;
  readonly updatedAt: string;
}

export interface DraftMemoryCard {
  readonly emoji: string;
  readonly phrase: string;
}

export const DEFAULT_CARDS: MemoryCard[] = [
  createMemoryCard({ emoji: "🌸", phrase: "春に見た花のこと" }),
  createMemoryCard({ emoji: "🍙", phrase: "好きだったお弁当" }),
  createMemoryCard({ emoji: "🚃", phrase: "よく出かけた場所" })
];

export function createMemoryCard(
  draft: DraftMemoryCard,
  now: Date = new Date()
): MemoryCard {
  return {
    id: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
    emoji: normalizeEmoji(draft.emoji),
    phrase: normalizePhrase(draft.phrase),
    updatedAt: now.toISOString()
  };
}

export function updateMemoryCard(
  card: MemoryCard,
  draft: DraftMemoryCard,
  now: Date = new Date()
): MemoryCard {
  return {
    ...card,
    emoji: normalizeEmoji(draft.emoji),
    phrase: normalizePhrase(draft.phrase),
    updatedAt: now.toISOString()
  };
}

export function normalizeCards(cards: readonly MemoryCard[]): MemoryCard[] {
  const normalized = cards
    .map((card) => ({
      ...card,
      emoji: normalizeEmoji(card.emoji),
      phrase: normalizePhrase(card.phrase)
    }))
    .filter((card) => card.phrase.length > 0);

  return normalized.length > 0 ? normalized : DEFAULT_CARDS;
}

export function getNextIndex(currentIndex: number, cardCount: number): number {
  if (cardCount <= 0) {
    return 0;
  }

  return (currentIndex + 1) % cardCount;
}

export function getPreviousIndex(currentIndex: number, cardCount: number): number {
  if (cardCount <= 0) {
    return 0;
  }

  return (currentIndex - 1 + cardCount) % cardCount;
}

export function clampCardIndex(index: number, cardCount: number): number {
  if (cardCount <= 0) {
    return 0;
  }

  return Math.min(Math.max(index, 0), cardCount - 1);
}

function normalizeEmoji(value: string): string {
  const trimmed = value.trim();
  return trimmed.length > 0 ? Array.from(trimmed).slice(0, 2).join("") : "💬";
}

function normalizePhrase(value: string): string {
  const phrase = value.trim().replace(/\s+/g, " ").slice(0, 48);
  return phrase.length > 0 ? phrase : "思い出のこと";
}
