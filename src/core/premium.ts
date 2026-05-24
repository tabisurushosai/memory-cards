export const PREMIUM_PRICE_LABEL = "$3";
export const TRIAL_DAYS = 7;
export const STRIPE_PAYMENT_LINK = "STRIPE_PAYMENT_LINK";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface PremiumStatus {
  readonly isPremiumActive: boolean;
  readonly trialDaysRemaining: number;
  readonly trialEndsAt: string;
}

export function calculatePremiumStatus(
  firstStartedAt: string,
  premiumPurchased: boolean,
  now: Date = new Date()
): PremiumStatus {
  const start = new Date(firstStartedAt);
  const safeStart = Number.isNaN(start.getTime()) ? now : start;
  const trialEndsAtMs = safeStart.getTime() + TRIAL_DAYS * MS_PER_DAY;
  const remainingMs = trialEndsAtMs - now.getTime();
  const trialDaysRemaining = Math.max(0, Math.ceil(remainingMs / MS_PER_DAY));
  const isPremiumActive = premiumPurchased || remainingMs > 0;

  return {
    isPremiumActive,
    trialDaysRemaining,
    trialEndsAt: new Date(trialEndsAtMs).toISOString()
  };
}
