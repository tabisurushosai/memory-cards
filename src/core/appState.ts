import { DEFAULT_CARDS, clampCardIndex, normalizeCards, type MemoryCard } from "./cards";

export interface AppState {
  cards: MemoryCard[];
  currentIndex: number;
  firstStartedAt: string;
  premiumPurchased: boolean;
}

export function createInitialState(now: Date = new Date()): AppState {
  return {
    cards: DEFAULT_CARDS,
    currentIndex: 0,
    firstStartedAt: now.toISOString(),
    premiumPurchased: false
  };
}

export function normalizeAppState(value: Partial<AppState> | undefined, now: Date = new Date()): AppState {
  const fallback = createInitialState(now);
  const cards = normalizeCards(Array.isArray(value?.cards) ? value.cards : fallback.cards);

  return {
    cards,
    currentIndex: clampCardIndex(
      typeof value?.currentIndex === "number" ? value.currentIndex : fallback.currentIndex,
      cards.length
    ),
    firstStartedAt:
      typeof value?.firstStartedAt === "string" && value.firstStartedAt.length > 0
        ? value.firstStartedAt
        : fallback.firstStartedAt,
    premiumPurchased: value?.premiumPurchased === true
  };
}
