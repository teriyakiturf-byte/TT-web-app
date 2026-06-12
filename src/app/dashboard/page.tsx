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
import WeatherWidget from "@/components/WeatherWidget";
import FertilizerWaitlistCard from "@/components/FertilizerWaitlistCard";
import { useWeather } from "@/hooks/useWeather";
import ToastNotification from "@/components/ui/ToastNotification";
import { useUserState } from "@/hooks/useUserState";
import type { LawnTask, ToastType } from "@/types";
import { calculateSavings } from "@/types";
import { formatGrassType, getCityFromZip } from "@/lib/utils";
import {
  PLAN_TASKS,
  TASK_COMPLETIONS_KEY,
  loadTaskCompletions,
  selectHeroTask,
  formatTaskQuantity as formatQuantity,
} from "@/lib/planTasks";

export default function DashboardPage() {
  const router = useRouter();
  const { isPaid, isFree, isGuest, loading, lawnSqft, grassType, zip, email } = useUserState();
  const { weather } = useWeather();

  const [tasks, setTasks] = useState<LawnTask[]>(() => {
    const saved = loadTaskCompletions();
    return PLAN_TASKS.map((t) => ({ ...t, isComplete: saved[t.id] ?? false }));
  });
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  // Persist completions to localStorage
  useEffect(() => {
    const completions: Record<string, boolean> = {};
    tasks.forEach((t) => { completions[t.id] = t.isComplete; });
    localStorage.setItem(TASK_COMPLETIONS_KEY, JSON.stringify(completions));
  }, [tasks]);

  // Route protection: guest → /, free → /plan, paid → stay
  if (!loading && !isPaid && typeof window !== "undefined") {
    if (isGuest) {
      router.push("/");
    } else if (isFree) {
      router.push("/plan");
    }
  }

  const displayGrass = grassType ? formatGrassType(grassType) : "Tall Fescue";
  const cityName = getCityFromZip(zip ?? "");

  const completedCount = tasks.filter((t) => t.isComplete).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const savings = lawnSqft ? calculateSavings(lawnSqft) : null;

  const heroTask = selectHeroTask(tasks);

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
          Your {cityName} Lawn Plan
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

        {/* Live Weather + Soil Temp Alert */}
        <div className="mt-6 space-y-3">
          {weather?.soilTempAlert && (
            <AlertBanner
              type="soil-temp"
              message={weather.soilTempAlert}
            />
          )}
          {(new Date().getMonth() === 7 ||
            (new Date().getMonth() === 8 && new Date().getDate() <= 20)) && (
            <AlertBanner
              type="overseeding-window"
              message="Fall Overseeding Window Open — Soil temps dropping. The Main Event starts now."
            />
          )}
          {new Date().getMonth() === 6 && (
            <AlertBanner
              type="overseeding-window"
              message={`Fall Overseeding window opens in ${Math.ceil(
                (new Date(new Date().getFullYear(), 7, 1).getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24 * 7)
              )} weeks — prep your equipment.`}
            />
          )}
          <WeatherWidget compact />
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

        {/* Fertilizer waitlist CTA — paid users only (Year 2 pre-sell) */}
        {isPaid && <FertilizerWaitlistCard userEmail={email} />}
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
