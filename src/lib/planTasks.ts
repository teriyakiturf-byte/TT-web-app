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

// ─── Task application windows ───────────────────────────────
//
// Plan tasks carry human-readable date strings ("Mar 15") rather than real
// Date objects. The reminder cron needs concrete dates to decide which task
// window opens in the coming week, so the helpers below parse those strings
// into Dates for a given calendar year. They are pure and server-safe (no
// browser globals), so they can run inside the cron route.

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

/** Parse a "Mon D" label (e.g. "Jun 15") into a local Date, or null. */
export function parseMonthDay(label: string, year: number): Date | null {
  const m = label.trim().match(/^([A-Za-z]{3})\s+(\d{1,2})$/);
  if (!m) return null;
  const month = MONTHS[m[1].toLowerCase()];
  if (month === undefined) return null;
  return new Date(year, month, Number(m[2]));
}

export interface TaskWindow {
  open: Date;
  close: Date;
}

/**
 * Resolve a task's application window for the given year. Prefers the date
 * range in `dueRange` ("Mar 15 – Apr 1"); when that has no parseable dates
 * (e.g. "When grass hits 4″"), falls back to the single `dueDate`.
 */
export function getTaskWindow(task: LawnTask, year: number): TaskWindow | null {
  const parts = (task.dueRange ?? "").split(/\s*[–—-]\s*/).map((s) => s.trim());
  let open = parts[0] ? parseMonthDay(parts[0], year) : null;
  let close = parts[1] ? parseMonthDay(parts[1], year) : null;
  if (!open) open = parseMonthDay(task.dueDate, year);
  if (!open) return null;
  if (!close) close = open;
  return { open, close };
}

export interface UpcomingTask {
  task: LawnTask;
  window: TaskWindow;
}

/**
 * Return every plan task whose window OPENS within `withinDays` of `now`
 * (inclusive of today), soonest first. Used by the reminder cron to decide
 * which task to surface to paid users this week.
 */
export function findUpcomingTasks(now: Date, withinDays: number): UpcomingTask[] {
  const year = now.getFullYear();
  const today = new Date(year, now.getMonth(), now.getDate());
  const horizon = new Date(today);
  horizon.setDate(horizon.getDate() + withinDays);

  return PLAN_TASKS.map((task) => ({ task, window: getTaskWindow(task, year) }))
    .filter(
      (t): t is UpcomingTask =>
        t.window !== null &&
        t.window.open >= today &&
        t.window.open <= horizon
    )
    .sort((a, b) => a.window.open.getTime() - b.window.open.getTime());
}
