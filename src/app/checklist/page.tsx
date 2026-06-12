"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import TaskRow from "@/components/ui/TaskRow";
import { useUserState } from "@/hooks/useUserState";
import type { LawnTask } from "@/types";
import { calculateQuantity } from "@/types";

const STORAGE_KEY = "tt_task_completions";

const FULL_PLAN: LawnTask[] = [
  // March
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
    complianceBadges: ["soil-temp-triggered"],
    taskType: "weed-pest",
    isWindowActive: true,
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
  },
  // April
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
    complianceBadges: ["apply-before-may"],
    taskType: "weed-pest",
    isWindowActive: true,
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
  },
  // May
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
  },
  // June
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
  },
  {
    id: "t8",
    name: "Summer Fertilizer (Slow-Release)",
    plainDescription:
      "Light feeding during heat stress. Too much nitrogen now burns grass. This application keeps color without causing damage.",
    productName: "Milorganite 6-4-0",
    labelRate: 6.4,
    applicationNotes: "Light summer feeding. Apply early morning to avoid heat stress.",
    tier: 3,
    dueDate: "Jun 15",
    dueRange: "Jun 15 – Jul 1",
    monthGroup: "June",
    isComplete: false,
    snoozeCount: 0,
    complianceBadges: [],
    taskType: "fertilizer",
  },
  // July
  {
    id: "t9",
    name: "Fungicide Application (If Needed)",
    plainDescription:
      "Treats brown patch and dollar spot — fungal diseases that thrive in KC's humid summers. Clay holds the moisture that feeds fungus. Apply at the first sign of disease and water only in the morning.",
    productName: "Scotts DiseaseEx",
    labelRate: 2.87,
    applicationNotes: "Apply if brown patch or dollar spot appear. Irrigate morning only.",
    tier: 3,
    dueDate: "Jul 1",
    dueRange: "Jul 1 – Jul 15",
    monthGroup: "July",
    isComplete: false,
    snoozeCount: 0,
    complianceBadges: [],
    taskType: "weed-pest",
  },
  // September
  {
    id: "t10",
    name: "Core Aerate Lawn",
    plainDescription:
      "Punches small holes in your clay soil so water and nutrients can actually reach the roots. KC clay compacts — aeration fixes it.",
    productName: "Rent core aerator",
    labelRate: 0,
    applicationNotes: "Best done when soil is moist. Make 2 passes in perpendicular directions.",
    tier: 1,
    dueDate: "Sep 1",
    dueRange: "Sep 1 – Sep 15",
    monthGroup: "September",
    isComplete: false,
    snoozeCount: 0,
    complianceBadges: [],
    taskType: "mechanical",
  },
  {
    id: "t11",
    name: "Overseed Thin Areas",
    plainDescription:
      "Fills in thin or bare spots by planting new grass seed. Only effective when soil temp is between 50°F and 65°F.",
    productName: "Tall Fescue Seed Blend",
    labelRate: 8,
    applicationNotes: "Overseed immediately after aeration. Keep seed moist for 2–3 weeks.",
    tier: 1,
    dueDate: "Sep 5",
    dueRange: "Sep 1 – Sep 20",
    monthGroup: "September",
    isComplete: false,
    snoozeCount: 0,
    complianceBadges: ["main-event"],
    taskType: "mechanical",
    isWindowActive: true,
  },
  {
    id: "t12",
    name: "Fall Fertilizer (Winterizer)",
    plainDescription:
      "The most important application of the year for cool-season grass. Builds root reserves for winter survival and spring green-up.",
    productName: "Milorganite 6-4-0",
    labelRate: 6.4,
    applicationNotes: "Final feeding builds root reserves for winter. Apply before first frost.",
    tier: 2,
    dueDate: "Oct 15",
    dueRange: "Oct 1 – Nov 1",
    monthGroup: "October",
    isComplete: false,
    snoozeCount: 0,
    complianceBadges: ["fall-window"],
    taskType: "fertilizer",
  },
  // November
  {
    id: "t13",
    name: "Final Mow — Lower to 2.5″",
    plainDescription:
      "Your last cut of the year, dropped to 2.5″ to prevent snow mold over winter. Shorter grass on KC clay dries faster and resists matting. Do it right before the grass stops growing.",
    productName: "Adjust mower deck",
    labelRate: 0,
    applicationNotes: "Lower height for last mow to prevent snow mold.",
    tier: 3,
    dueDate: "Nov 1",
    dueRange: "Late October – early November",
    monthGroup: "November",
    isComplete: false,
    snoozeCount: 0,
    complianceBadges: [],
    taskType: "mechanical",
  },
  {
    id: "t14",
    name: "Leaf Cleanup — Mulch or Remove",
    plainDescription:
      "Mulches or clears fallen leaves before they smother the lawn. Wet leaves trap moisture against KC clay and kill the grass underneath. Stay on top of it through late fall.",
    productName: "Mulching mower blade",
    labelRate: 0,
    applicationNotes: "Mulch thin layers. Remove heavy accumulations to prevent suffocation.",
    tier: 3,
    dueDate: "Nov 10",
    dueRange: "Oct 15 – Nov 30",
    monthGroup: "November",
    isComplete: false,
    snoozeCount: 0,
    complianceBadges: [],
    taskType: "mechanical",
  },
];

const MONTH_ORDER = [
  "March", "April", "May", "June", "July", "August",
  "September", "October", "November", "December", "January", "February",
];

type FilterType = "all" | "fertilizer" | "weed-pest" | "mechanical";

function formatQuantity(lawnSqft: number | null, labelRate: number): string {
  if (labelRate === 0) return "—";
  if (!lawnSqft) return "Add lawn size →";
  return `${calculateQuantity(lawnSqft, labelRate)} lbs`;
}

function loadSavedCompletions(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export default function ChecklistPage() {
  const router = useRouter();
  const { isPaid, isFree, isGuest, loading, lawnSqft } = useUserState();

  const [tasks, setTasks] = useState<LawnTask[]>(() => {
    const saved = loadSavedCompletions();
    return FULL_PLAN.map((t) => ({ ...t, isComplete: saved[t.id] ?? false }));
  });
  const [filter, setFilter] = useState<FilterType>("all");

  // Persist completions to localStorage
  useEffect(() => {
    const completions: Record<string, boolean> = {};
    tasks.forEach((t) => { completions[t.id] = t.isComplete; });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completions));
  }, [tasks]);

  // Route protection: guest → /, free → /plan
  if (!loading && !isPaid && typeof window !== "undefined") {
    if (isGuest) {
      router.push("/");
    } else if (isFree) {
      router.push("/plan");
    }
  }

  function toggleTask(taskId: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, isComplete: !t.isComplete } : t
      )
    );
  }

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((t) => t.taskType === filter);

  // Group by month
  const groupedByMonth = MONTH_ORDER.reduce<Record<string, LawnTask[]>>(
    (acc, month) => {
      const monthTasks = filteredTasks.filter((t) => t.monthGroup === month);
      if (monthTasks.length > 0) acc[month] = monthTasks;
      return acc;
    },
    {}
  );

  const completedCount = tasks.filter((t) => t.isComplete).length;
  const totalCount = tasks.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <>
      <Nav userState="paid" />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="font-display text-hero text-forest text-center">
          Task Checklist
        </h1>
        <p className="text-sm text-muted text-center mt-2">
          {lawnSqft
            ? `${lawnSqft.toLocaleString()} sq ft · Zone 6a · All quantities calculated for your lawn`
            : "Zone 6a · Add your lawn size to see exact quantities"}
        </p>

        {/* Navigation Tabs */}
        <div className="flex gap-1 mt-6 border-b border-border overflow-x-auto">
          {[
            { label: "Overview", href: "/dashboard", active: false },
            { label: "Checklist", href: "/checklist", active: true },
            { label: "Calendar", href: "/calendar", active: false },
          ].map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              className={`flex-shrink-0 px-4 py-2 font-display text-sm uppercase tracking-wider transition-colors ${
                tab.active
                  ? "text-forest border-b-2 border-lime -mb-px"
                  : "text-muted hover:text-forest"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-6 rounded-xl border border-border bg-white p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="font-mono text-xs text-muted uppercase tracking-wide">
              Overall Progress
            </p>
            <p className="font-mono text-sm text-forest font-medium">
              {completedCount} / {totalCount} tasks
            </p>
          </div>
          <div className="h-2 rounded-full bg-lime-light overflow-hidden">
            <div
              className="h-full rounded-full bg-lime transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
          {(
            [
              { key: "all", label: "All Tasks" },
              { key: "fertilizer", label: "Fertilizer" },
              { key: "weed-pest", label: "Weed & Pest" },
              { key: "mechanical", label: "Mechanical" },
            ] as { key: FilterType; label: string }[]
          ).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex-shrink-0 rounded-full px-4 py-1.5 font-mono text-xs transition-colors ${
                filter === f.key
                  ? "bg-forest text-white"
                  : "bg-white border border-border text-muted hover:bg-cream"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Tasks grouped by month */}
        <div className="mt-6 space-y-8">
          {Object.entries(groupedByMonth).map(([month, monthTasks]) => {
            const monthComplete = monthTasks.filter((t) => t.isComplete).length;
            return (
              <div key={month}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-display text-xl text-forest">{month}</h2>
                  <span className="font-mono text-xs text-muted">
                    {monthComplete}/{monthTasks.length} done
                  </span>
                </div>
                <div className="space-y-2">
                  {monthTasks.map((task) => (
                    <TaskRow
                      key={task.id}
                      taskName={task.name}
                      plainDescription={task.plainDescription}
                      productName={task.productName}
                      quantity={formatQuantity(lawnSqft, task.labelRate)}
                      dueDate={task.dueRange ?? task.dueDate}
                      isComplete={task.isComplete}
                      complianceBadges={task.complianceBadges}
                      onToggle={() => toggleTask(task.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Back to dashboard */}
        <div className="mt-8 mb-8 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-lime hover:text-forest transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    </>
  );
}
