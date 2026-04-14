"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import HeroTaskCard from "@/components/ui/HeroTaskCard";
import StatCard from "@/components/ui/StatCard";
import TaskRow from "@/components/ui/TaskRow";
import SeasonPill from "@/components/ui/SeasonPill";
import AlertBanner from "@/components/ui/AlertBanner";
import LawnInfoChip from "@/components/ui/LawnInfoChip";
import ToastNotification from "@/components/ui/ToastNotification";
import { useUserState } from "@/hooks/useUserState";
import type { LawnTask, ToastType } from "@/types";
import { calculateSavings, calculateQuantity } from "@/types";

const STORAGE_KEY = "tt_task_completions";

const PLAN_TASKS: LawnTask[] = [
  {
    id: "t1",
    name: "Apply Pre-Emergent (Split App #1)",
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
    complianceBadges: ["blackout-compliant", "joco-law"],
    taskType: "weed-pest",
  },
  {
    id: "t2",
    name: "First Mow — Set Height to 3.5″",
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
  {
    id: "t3",
    name: "Broadleaf Weed Spray",
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
    complianceBadges: ["no-phosphorus"],
    taskType: "weed-pest",
  },
  {
    id: "t4",
    name: "Pre-Emergent Split App #2",
    productName: "Prodiamine 65 WDG",
    labelRate: 0.86,
    applicationNotes: "Second split application extends barrier through summer. Water in.",
    tier: 3,
    dueDate: "Apr 20",
    dueRange: "Apr 15 – May 1",
    monthGroup: "April",
    isComplete: false,
    snoozeCount: 0,
    complianceBadges: ["blackout-compliant"],
    taskType: "weed-pest",
  },
  {
    id: "t5",
    name: "Spring Fertilizer Application",
    productName: "Milorganite 6-4-0",
    labelRate: 32,
    applicationNotes: "Apply at 32 lbs per 1,000 sq ft. Safe on all grass types. No burn risk.",
    tier: 3,
    dueDate: "May 1",
    dueRange: "May 1 – May 15",
    monthGroup: "May",
    isComplete: false,
    snoozeCount: 0,
    complianceBadges: ["blackout-compliant"],
    taskType: "fertilizer",
  },
  {
    id: "t6",
    name: "Grub Preventative",
    productName: "GrubEx (Chlorantraniliprole)",
    labelRate: 1.1,
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
  {
    id: "t7",
    name: "Raise Mow Height to 4″",
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
    productName: "Milorganite 6-4-0",
    labelRate: 32,
    applicationNotes: "Light summer feeding. Apply early morning to avoid heat stress.",
    tier: 4,
    dueDate: "Jun 15",
    dueRange: "Jun 15 – Jul 1",
    monthGroup: "June",
    isComplete: false,
    snoozeCount: 0,
    complianceBadges: ["blackout-compliant"],
    taskType: "fertilizer",
  },
];

function formatQuantity(lawnSqft: number | null, labelRate: number): string {
  if (labelRate === 0) return "—";
  if (!lawnSqft) return "Add your lawn size →";
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

export default function DashboardPage() {
  const router = useRouter();
  const { isPaid, isFree, isGuest, loading, lawnSqft, grassType } = useUserState();

  const [tasks, setTasks] = useState<LawnTask[]>(() => {
    const saved = loadSavedCompletions();
    return PLAN_TASKS.map((t) => ({ ...t, isComplete: saved[t.id] ?? false }));
  });
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  // Persist completions to localStorage
  useEffect(() => {
    const completions: Record<string, boolean> = {};
    tasks.forEach((t) => { completions[t.id] = t.isComplete; });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completions));
  }, [tasks]);

  // Route protection: guest → /, free → /plan, paid → stay
  if (!loading && !isPaid && typeof window !== "undefined") {
    if (isGuest) {
      router.push("/");
    } else if (isFree) {
      router.push("/plan");
    }
  }

  const displayGrass = grassType
    ? grassType.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    : "Tall Fescue";

  const completedCount = tasks.filter((t) => t.isComplete).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const savings = lawnSqft ? calculateSavings(lawnSqft) : null;

  const heroTask = tasks
    .filter((t) => !t.isComplete)
    .sort((a, b) => a.tier - b.tier)[0];

  const upcomingTasks = tasks
    .filter((t) => !t.isComplete && t.id !== heroTask?.id)
    .slice(0, 5);

  // Count distinct products with labelRate > 0 that aren't complete
  const productsNeeded = new Set(
    tasks.filter((t) => !t.isComplete && t.labelRate > 0).map((t) => t.productName)
  ).size;

  function toggleTask(taskId: string) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const next = { ...t, isComplete: !t.isComplete };
        if (next.isComplete) {
          setToast({ type: "success", message: `✓ ${t.name} — marked complete` });
        }
        return next;
      })
    );
  }

  const handleDismissToast = useCallback(() => setToast(null), []);

  function handleMarkComplete() {
    if (heroTask) toggleTask(heroTask.id);
  }

  function handleSnooze() {
    if (heroTask) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === heroTask.id
            ? { ...t, snoozeCount: t.snoozeCount + 1 }
            : t
        )
      );
    }
  }

  function handleSkip() {
    if (heroTask) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === heroTask.id ? { ...t, isComplete: true } : t
        )
      );
      setToast({ type: "success", message: `Skipped: ${heroTask.name}` });
    }
  }

  const springTasks = tasks.filter((t) =>
    ["March", "April", "May"].includes(t.monthGroup)
  );
  const springCompleted = springTasks.filter((t) => t.isComplete).length;
  const springPercent =
    springTasks.length > 0
      ? Math.round((springCompleted / springTasks.length) * 100)
      : 0;

  return (
    <>
      <Nav userState="paid" />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="font-display text-hero text-forest text-center">
          Your KC Lawn Plan
        </h1>
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          <LawnInfoChip type="zone" value="Zone 6a — KC" />
          <LawnInfoChip type="grass-type" value={displayGrass} />
          {lawnSqft ? (
            <LawnInfoChip
              type="lawn-size"
              value={`${lawnSqft.toLocaleString()} sq ft`}
            />
          ) : (
            <a
              href="/measure"
              className="inline-flex items-center gap-1.5 rounded-full bg-orange-light px-3 py-1 text-xs font-mono text-orange hover:bg-orange/20 transition-colors"
            >
              Add your lawn size →
            </a>
          )}
          <LawnInfoChip type="soil" value="Heavy Clay" />
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 mt-6 border-b border-border overflow-x-auto">
          {[
            { label: "Overview", href: "/dashboard", active: true },
            { label: "Checklist", href: "/checklist", active: false },
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

        {/* Prompt to add lawn size if missing */}
        {!lawnSqft && (
          <div className="mt-4 rounded-xl border-2 border-dashed border-orange/40 bg-orange-light p-4 text-center">
            <p className="text-sm text-charcoal">
              Add your lawn size to see <strong>exact product quantities</strong> for every task.
            </p>
            <a
              href="/measure"
              className="mt-2 inline-block rounded-lg bg-orange px-4 py-2 font-display text-sm text-white uppercase tracking-wider hover:bg-orange/90 transition-colors"
            >
              Measure My Lawn →
            </a>
          </div>
        )}

        {/* Alert Banners */}
        <div className="mt-6 space-y-2">
          <AlertBanner
            type="soil-temp"
            message="Soil temps hitting 55°F in KC — pre-emergent window closing fast."
          />
          <AlertBanner
            type="blackout-active"
            message="Johnson County fertilizer blackout: Nov 15 – Mar 1. No phosphorus applications."
            expiresAt={new Date("2026-03-01")}
          />
        </div>

        {/* Hero Task Card */}
        <div className="mt-6">
          {heroTask ? (
            <HeroTaskCard
              taskName={heroTask.name}
              productName={heroTask.productName}
              calculatedQuantity={formatQuantity(lawnSqft, heroTask.labelRate)}
              applicationNotes={heroTask.applicationNotes}
              tier={heroTask.tier}
              userState="paid"
              onMarkComplete={handleMarkComplete}
              onSnooze={handleSnooze}
              onSkip={handleSkip}
              snoozeCount={heroTask.snoozeCount}
              whyContext={heroTask.whyContext}
            />
          ) : (
            <HeroTaskCard
              taskName=""
              productName=""
              calculatedQuantity=""
              applicationNotes=""
              tier={5}
              userState="paid"
              onMarkComplete={() => {}}
              onSnooze={() => {}}
              onSkip={() => {}}
              snoozeCount={0}
            />
          )}
        </div>

        {/* Stats Row */}
        <div className="flex gap-3 mt-6 overflow-x-auto pb-2">
          <StatCard
            label="Tasks Done"
            value={`${completedCount} / ${totalCount}`}
            subtitle={`Spring: ${springCompleted} of ${springTasks.length}`}
            progress={progressPercent}
          />
          <StatCard
            label="Products Needed"
            value={`${productsNeeded}`}
            subtitle="distinct products to buy"
          />
          <StatCard
            label="DIY Savings"
            value={savings ? `$${savings.annualSavings}/yr` : "—"}
            subtitle={savings ? `$${savings.fiveYearSavings} over 5 yrs` : "Add lawn size"}
          />
          <StatCard
            label="Next Task"
            value={upcomingTasks[0]?.dueDate ?? "—"}
            subtitle={upcomingTasks[0]?.name.slice(0, 20) ?? "All done!"}
          />
        </div>

        {/* Year at a Glance */}
        <div className="mt-8">
          <h2 className="font-display text-xl text-forest mb-3">
            Year at a Glance
          </h2>
          <div className="flex gap-2">
            <SeasonPill
              season="spring"
              status="current"
              completionPercent={springPercent}
              taskCount={springTasks.length - springCompleted}
            />
            <SeasonPill season="summer" status="future" startDate="Jun 1" />
            <SeasonPill season="fall" status="future" startDate="Sep 1" />
            <SeasonPill season="winter" status="future" startDate="Nov 15" />
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-xl text-forest">
              Upcoming Tasks
            </h2>
            <a
              href="/checklist"
              className="text-sm text-lime hover:text-forest transition-colors"
            >
              View All →
            </a>
          </div>
          <div className="space-y-2">
            {upcomingTasks.map((task) => (
              <TaskRow
                key={task.id}
                taskName={task.name}
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

        {/* DIY Savings Counter */}
        {savings ? (
          <div className="mt-8 rounded-xl bg-forest p-6 text-white text-center">
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/60 mb-2">
              Your DIY Savings vs. TruGreen
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="font-display text-3xl text-white/50">
                  ~${savings.annualProCost}
                </p>
                <p className="font-mono text-[10px] text-white/40">TruGreen/yr</p>
              </div>
              <div>
                <p className="font-display text-3xl text-lime">
                  ~${savings.annualDiyCost}
                </p>
                <p className="font-mono text-[10px] text-white/60">DIY w/ plan/yr</p>
              </div>
              <div>
                <p className="font-display text-3xl text-orange">
                  ~${savings.annualSavings}
                </p>
                <p className="font-mono text-[10px] text-orange">You save/yr</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-xl bg-forest p-6 text-white text-center">
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/60 mb-2">
              Your DIY Savings vs. TruGreen
            </p>
            <p className="text-sm text-white/70 mt-2">
              Add your lawn size to see personalized savings calculations.
            </p>
            <a
              href="/measure"
              className="mt-3 inline-block rounded-lg bg-orange px-4 py-2 font-display text-sm text-white uppercase tracking-wider hover:bg-orange/90 transition-colors"
            >
              Measure My Lawn →
            </a>
          </div>
        )}

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-2 gap-3 mb-8">
          <Link
            href="/checklist"
            className="rounded-xl border border-border bg-white p-4 text-center hover:bg-cream transition-colors"
          >
            <p className="font-display text-lg text-forest">Full Checklist</p>
            <p className="text-xs text-muted mt-1">All tasks by month</p>
          </Link>
          <Link
            href="/calendar"
            className="rounded-xl border border-border bg-white p-4 text-center hover:bg-cream transition-colors"
          >
            <p className="font-display text-lg text-forest">Calendar View</p>
            <p className="text-xs text-muted mt-1">Visual schedule</p>
          </Link>
        </div>
      </main>

      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onDismiss={handleDismissToast}
        />
      )}
    </>
  );
}
