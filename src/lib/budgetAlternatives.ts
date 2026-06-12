/**
 * Budget product alternatives shown alongside the premium recommendation in
 * each task detail view. Each premium retail brand we recommend maps to its
 * pro-grade DoMyOwn equivalent, with the typical savings and a short note.
 */

export interface BudgetAlternative {
  budget: string;
  savings: string;
  note: string;
}

export const budgetAlternatives: Record<string, BudgetAlternative> = {
  "Scotts Turf Builder": {
    budget: "Lebanon Pro 18-0-6 (DoMyOwn)",
    savings: "~35% cheaper per sq ft",
    note: "Professional grade. Same results, better value.",
  },
  "Scotts DiseaseEx": {
    budget: "Propiconazole 14.3 (DoMyOwn)",
    savings: "~50% cheaper",
    note: "Same active ingredient as premium brands.",
  },
  "Scotts Halts": {
    budget: "Pendulum 2G (DoMyOwn)",
    savings: "~40% cheaper",
    note: "Professional pre-emergent. Longer residual.",
  },
  "Jonathan Green": {
    budget: "Lesco Renovator (DoMyOwn)",
    savings: "~30% cheaper",
    note: "Professional turf supply. What the pros use.",
  },
};

/**
 * Resolve the budget alternative for a premium product name. Matches when the
 * product name contains a mapped premium brand, so "Scotts DiseaseEx Lawn
 * Fungicide" still resolves to its DoMyOwn equivalent. Returns `undefined`
 * when there is no mapping (callers render nothing in that case).
 */
export function getBudgetAlternative(
  productName: string | undefined | null
): BudgetAlternative | undefined {
  if (!productName) return undefined;
  const key = Object.keys(budgetAlternatives).find((k) =>
    productName.includes(k)
  );
  return key ? budgetAlternatives[key] : undefined;
}
