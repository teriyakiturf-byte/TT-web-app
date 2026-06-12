import type { LawnTask } from "@/types";
import { calculateQuantity } from "@/types";

/**
 * Shared lawn-plan task source.
 *
 * Both the dashboard and the post-purchase success screen read from this one
 * place so the "highest-priority task" they surface always agree. Completions
 * are tracked client-side in localStorage under {@link TASK_COMPLETIONS_KEY}.
 */
export const TASK_COMPLETIONS_KEY = "tt_task_completions";

export const PLAN_TASKS: LawnTask[] = [
  {
    id: "t1",
    name: "Apply Pre-Emergent (Split App #1)",
    plainDescription:
      "Stops crabgrass and weeds before they sprout. Miss this and you chase weeds all summer. Apply before soil hits 55°F.",
    productName: "Prodiamine 65 WDG",
    labelRate: 0.86,
    applicationNotes: "Apply when soil temps reach 50–55°F. Water in within 24 hours.",
    tier: 1,
    dueDate: "Mar 15",
    dueRange: "Mar 15 – Apr 1",
    monthGroup: "March",
    isComplete: false,
    snoozeCount: 0,
    whyContext: "Soil temps in KC are crossing 55°F — your crabgrass pre-emergent window is closing.",
    complianceBadges: ["soil-temp-triggered"],
    taskType: "weed-pest",
    estTimeMin: 30,
    estCost: 18,
  },
  {
    id: "t2",
    name: "First Mow — Set Height to 3.5″",
    plainDescription:
      "Your first cut wakes the lawn and clears winter debris. Cutting at 3.5″ shades KC clay so it holds moisture instead of baking. Mow once the grass reaches 4 inches.",
    productName: "Mower blade sharpened",
    labelRate: 0,
    applicationNotes: "Mow when grass reaches 4 inches. Never remove more than ⅓ of blade height.",
    tier: 3,
    dueDate: "Mar 20",
    dueRange: "When grass hits 4″",
    monthGroup: "March",
    isComplete: false,
    snoozeCount: 0,
    complianceBadges: [],
    taskType: "mechanical",
    estTimeMin: 45,
    estCost: 0,
  },
  {
    id: "t3",
    name: "Broadleaf Weed Spray",
    plainDescription:
      "Targets dandelions, clover, and other flat-leafed weeds without harming your grass. Apply when weeds are actively growing.",
    productName: "Trimec Classic",
    labelRate: 0.42,
    applicationNotes: "Spot-spray or broadcast when daytime temps are 60–80°F. Avoid rain for 24h.",
    tier: 2,
    dueDate: "Apr 15",
    dueRange: "Apr 15 – May 1",
    monthGroup: "April",
    isComplete: false,
    snoozeCount: 0,
    whyContext: "Spring broadleaf weeds (dandelion, clover) are actively growing — herbicide is most effective now.",
    complianceBadges: ["apply-before-may"],
    taskType: "weed-pest",
    estTimeMin: 25,
    estCost: 15,
  },
  {
    id: "t4",
    name: "Pre-Emergent Split App #2",
    plainDescription:
      "The second half of your pre-emergent barrier. Splitting the dose keeps crabgrass blocked as KC clay heats up through summer. Apply 6–8 weeks after the first application.",
    productName: "Prodiamine 65 WDG",
    labelRate: 0.86,
    applicationNotes: "Second split application extends barrier through summer. Water in.",
    tier: 3,
    dueDate: "Apr 20",
    dueRange: "Apr 15 – May 1",
    monthGroup: "April",
    isComplete: false,
    snoozeCount: 0,
    complianceBadges: ["apply-before-may"],
    taskType: "weed-pest",
    estTimeMin: 30,
    estCost: 18,
  },
  {
    id: "t5",
    name: "Spring Fertilizer Application",
    plainDescription:
      "Wakes up your lawn after winter. Jumpstarts root growth and gives grass the nitrogen it needs to green up fast.",
    productName: "Milorganite 6-4-0",
    labelRate: 6.4,
    applicationNotes: "Apply at 6.4 lbs per 1,000 sq ft. Safe on all grass types. No burn risk.",
    tier: 3,
    dueDate: "May 1",
    dueRange: "May 1 – May 15",
    monthGroup: "May",
    isComplete: false,
    snoozeCount: 0,
    complianceBadges: ["slow-release-safe"],
    taskType: "fertilizer",
    estTimeMin: 30,
    estCost: 22,
  },
  {
    id: "t6",
    name: "Grub Preventative",
    plainDescription:
      "Stops grubs before they hatch and chew through your roots. KC lawns on clay are prime grub territory. Apply in late spring and water it in.",
    productName: "GrubEx (Chlorantraniliprole)",
    labelRate: 2.9,
    applicationNotes: "Apply preventative before grub eggs hatch. Water in well.",
    tier: 3,
    dueDate: "May 15",
    dueRange: "May 15 – Jun 1",
    monthGroup: "May",
    isComplete: false,
    snoozeCount: 0,
    complianceBadges: [],
    taskType: "weed-pest",
    estTimeMin: 20,
    estCost: 25,
  },
  {
    id: "t7",
    name: "Raise Mow Height to 4″",
    plainDescription:
      "Taller grass shades the soil so KC clay stays cooler and holds water through summer heat — and it crowds out weeds. Raise your deck to 4″ before June heat sets in.",
    productName: "Adjust mower deck",
    labelRate: 0,
    applicationNotes: "Taller grass shades soil, reducing weed germination and water loss.",
    tier: 3,
    dueDate: "Jun 1",
    dueRange: "Jun 1 – Jun 15",
    monthGroup: "June",
    isComplete: false,
    snoozeCount: 0,
    complianceBadges: [],
    taskType: "mechanical",
    estTimeMin: 30,
    estCost: 0,
  },
  {
    id: "t8",
    name: "Summer Fertilizer (Slow-Release)",
    plainDescription:
      "Light feeding during heat stress. Too much nitrogen now burns grass. This application keeps color without causing damage.",
    productName: "Milorganite 6-4-0",
    labelRate: 6.4,
    applicationNotes: "Light summer feeding. Apply early morning to avoid heat stress.",
    tier: 4,
    dueDate: "Jun 15",
    dueRange: "Jun 15 – Jul 1",
    monthGroup: "June",
    isComplete: false,
    snoozeCount: 0,
    complianceBadges: [],
    taskType: "fertilizer",
    estTimeMin: 30,
    estCost: 22,
  },
];

/** Read the persisted task-completion map from localStorage (SSR-safe). */
export function loadTaskCompletions(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(TASK_COMPLETIONS_KEY) || "{}");
  } catch {
    return {};
  }
}

/** The plan tasks with their persisted completion state applied. */
export function getTasksWithCompletions(): LawnTask[] {
  const saved = loadTaskCompletions();
  return PLAN_TASKS.map((t) => ({ ...t, isComplete: saved[t.id] ?? false }));
}

/**
 * 5-tier priority algorithm: surface the single highest-priority incomplete
 * task. Lower tier number = higher priority (Tier 1 = deadline approaching).
 */
export function selectHeroTask(tasks: LawnTask[]): LawnTask | undefined {
  return tasks.filter((t) => !t.isComplete).sort((a, b) => a.tier - b.tier)[0];
}

/** Format the per-task product quantity for the given lawn size. */
export function formatTaskQuantity(
  lawnSqft: number | null,
  labelRate: number
): string {
  if (labelRate === 0) return "—";
  if (!lawnSqft) return "Add your lawn size →";
  return `${calculateQuantity(lawnSqft, labelRate)} lbs`;
}

/* ── Season progress ──────────────────────────────────────────────────────
 * Measures how far through the seasonal task window the user is: of the tasks
 * whose due date has already arrived ("due so far"), how many are complete.
 * Powers the post-completion toast and the dashboard season-progress bar.
 */

const MONTH_ABBR_INDEX: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

/**
 * Parse a task `dueDate` like `"Mar 15"` into a Date in the given year.
 * Returns null for anything that isn't a recognizable "Mon DD" string.
 */
export function parseDueDate(dueDate: string, year: number): Date | null {
  const match = dueDate.trim().match(/^([A-Za-z]{3})\s+(\d{1,2})$/);
  if (!match) return null;
  const month = MONTH_ABBR_INDEX[match[1]];
  if (month === undefined) return null;
  return new Date(year, month, parseInt(match[2], 10));
}

export type SeasonStatusLevel = "ahead" | "on-track" | "behind";

export interface SeasonProgress {
  /** Tasks whose due date is on or before today. */
  totalDueTasks: number;
  /** Of those due tasks, how many are marked complete. */
  completedCount: number;
  /** completedCount / totalDueTasks, rounded and capped at 100. */
  percentage: number;
  /** Due tasks that are still incomplete (overdue). */
  overdueCount: number;
  /** ahead ≥ 80%, on-track 50–79%, behind < 50%. */
  status: SeasonStatusLevel;
  /** Highest-priority incomplete task to surface as "do this next". */
  nextTaskName: string | null;
}

/**
 * Compute season progress from the task list. A task counts toward the
 * denominator once its `dueDate` has arrived (≤ `now`); the numerator is those
 * due tasks that are complete.
 */
export function computeSeasonProgress(
  tasks: LawnTask[],
  now: Date = new Date()
): SeasonProgress {
  const year = now.getFullYear();
  const dueTasks = tasks.filter((t) => {
    const due = parseDueDate(t.dueDate, year);
    return due !== null && due.getTime() <= now.getTime();
  });

  const totalDueTasks = dueTasks.length;
  const completedCount = dueTasks.filter((t) => t.isComplete).length;
  const overdueCount = totalDueTasks - completedCount;
  const percentage =
    totalDueTasks > 0
      ? Math.min(100, Math.round((completedCount / totalDueTasks) * 100))
      : 100; // nothing due yet → not behind

  const status: SeasonStatusLevel =
    percentage >= 80 ? "ahead" : percentage >= 50 ? "on-track" : "behind";

  return {
    totalDueTasks,
    completedCount,
    percentage,
    overdueCount,
    status,
    nextTaskName: selectHeroTask(tasks)?.name ?? null,
  };
}

/**
 * The toast copy shown right after a task is completed, keyed off how far the
 * user is through the season. The "behind" case carries a sub-message naming
 * the next task to prioritize.
 */
export function seasonToastMessage(
  progress: SeasonProgress
): { message: string; subMessage?: string } {
  if (progress.percentage >= 80) {
    return {
      message:
        "You're ahead of schedule. Your lawn is on track for a strong season.",
    };
  }
  if (progress.percentage >= 50) {
    return {
      message: "Good progress. You're keeping up with the KC lawn calendar.",
    };
  }
  return {
    message: "You're behind the seasonal window.",
    subMessage: progress.nextTaskName
      ? `Prioritize next: ${progress.nextTaskName}`
      : undefined,
  };
}
