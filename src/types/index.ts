/* ── User & Auth ── */
export type UserState = "guest" | "free" | "paid";

export interface UserProfile {
  id: string;
  email: string;
  zipCode?: string;
  zone?: string;
  grassType?: GrassType;
  lawnSqft?: number;
  soilType?: string;
  userState: UserState;
  createdAt: Date;
}

export type GrassType =
  | "tall-fescue"
  | "kentucky-bluegrass"
  | "zoysia"
  | "buffalo-grass"
  | "mixed-unsure";

/* ── Tasks ── */
export type TaskTier = 1 | 2 | 3 | 4 | 5;

export interface LawnTask {
  id: string;
  name: string;
  productName: string;
  labelRate: number; // lbs per 1,000 sqft
  applicationNotes: string;
  tier: TaskTier;
  dueDate: string;
  dueRange?: string;
  monthGroup: string;
  isComplete: boolean;
  snoozeCount: number;
  whyContext?: string;
  complianceBadges?: ComplianceBadgeType[];
  taskType: "fertilizer" | "weed-pest" | "mechanical";
}

/* ── Compliance ── */
export type ComplianceBadgeType =
  | "blackout-compliant"
  | "no-phosphorus"
  | "joco-law";

/* ── Alerts ── */
export type AlertType =
  | "blackout-active"
  | "soil-temp"
  | "deadline"
  | "upcoming-window";

/* ── Seasons ── */
export type Season = "spring" | "summer" | "fall" | "winter";
export type SeasonStatus = "past" | "current" | "future";

/* ── Milestones ── */
export type MilestoneStatus = "completed" | "current" | "upcoming";

/* ── Empty States ── */
export type EmptyStateVariant =
  | "measurement"
  | "task-checklist"
  | "faq-no-results"
  | "weather-unavailable"
  | "dashboard";

/* ── Toast ── */
export type ToastType = "success" | "alert" | "error";

/* ── Lawn Info ── */
export type LawnInfoChipType = "lawn-size" | "grass-type" | "zone" | "soil";

/* ── Calculations ── */
export function calculateQuantity(
  lawnSqft: number,
  labelRate: number
): number {
  return Math.round(((lawnSqft / 1000) * labelRate) * 10) / 10;
}

export function calculateSavings(lawnSqft: number) {
  const annualProCost = (lawnSqft / 5000) * 527;
  const annualDiyCost = (lawnSqft / 5000) * 154;
  const annualSavings = (lawnSqft / 5000) * 373;
  const fiveYearSavings = annualSavings * 5;
  return {
    annualProCost: Math.round(annualProCost),
    annualDiyCost: Math.round(annualDiyCost),
    annualSavings: Math.round(annualSavings),
    fiveYearSavings: Math.round(fiveYearSavings),
  };
}
