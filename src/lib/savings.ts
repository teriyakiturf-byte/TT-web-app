import type { LawnSize } from "@/lib/lawnProfileOptions";

// Personalized savings math for the landing-page / onboarding / plan-preview
// counter (#29). Competitor pricing is a hardcoded KC-metro snapshot: a base
// annual program fee plus a per-sq-ft component. Five companies are averaged so
// the "average KC lawn service" figure isn't anchored to a single competitor.
export const competitorPricing = {
  trugreen: { base: 399, perSqFt: 0.06 },
  ryanLawn: { base: 349, perSqFt: 0.062 },
  weedMan: { base: 299, perSqFt: 0.051 },
  customLawn: { base: 329, perSqFt: 0.055 },
  turfGeeks: { base: 279, perSqFt: 0.048 },
} as const;

// Representative sq ft for each onboarding size bucket. Mirrors the midpoints in
// SIZE_OPTIONS (lawnProfileOptions.ts) so the counter and the radio cards agree.
export const sizeMidpoints: Record<LawnSize, number> = {
  small: 2000,
  medium: 5000,
  large: 9500,
  xl: 15000,
};

// Human-readable label for the description line ("Based on a medium lawn …").
export const sizeLabels: Record<LawnSize, string> = {
  small: "small",
  medium: "medium",
  large: "large",
  xl: "XL",
};

export interface SavingsResult {
  /** Mean annual cost across the five competitors, rounded. */
  avgAnnual: number;
  /** Priciest competitor's annual cost, rounded. */
  maxAnnual: number;
  /** First-year savings vs. the average, after the one-time $67 plan. */
  savings: number;
  /** Representative sq ft for the chosen size bucket. */
  sqFt: number;
}

// The one-time Teriyaki Turf plan price the savings are measured against.
const TT_PLAN_PRICE = 67;

export function calculateSavings(size: LawnSize): SavingsResult {
  const sqFt = sizeMidpoints[size];
  const annualCosts = Object.values(competitorPricing).map((p) =>
    Math.round(p.base + p.perSqFt * sqFt),
  );
  const avgAnnual = Math.round(
    annualCosts.reduce((a, b) => a + b, 0) / annualCosts.length,
  );
  const maxAnnual = Math.round(Math.max(...annualCosts));
  const savings = avgAnnual - TT_PLAN_PRICE;
  return { avgAnnual, maxAnnual, savings, sqFt };
}
