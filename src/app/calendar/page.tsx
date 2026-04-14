"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import Nav from "@/components/Nav";
import { useUserState } from "@/hooks/useUserState";

const YEAR = 2026;

/* ── Calendar task placement data ── */

interface CalendarTask {
  id: string;
  name: string;
  month: number; // 1-12
  day: number;
  endMonth?: number;
  endDay?: number;
  type: "fertilizer" | "weed-pest" | "mechanical";
}

const CALENDAR_TASKS: CalendarTask[] = [
  { id: "task_001", name: "Pre-Emergent #1", month: 3, day: 15, endMonth: 4, endDay: 1, type: "fertilizer" },
  { id: "task_002", name: "First Mow", month: 3, day: 15, type: "mechanical" },
  { id: "task_003", name: "Broadleaf Spray", month: 4, day: 15, endMonth: 5, endDay: 1, type: "weed-pest" },
  { id: "task_004", name: "Spring Fertilizer", month: 5, day: 1, endMonth: 5, endDay: 15, type: "fertilizer" },
  { id: "task_005", name: "Grub Preventative", month: 5, day: 15, endMonth: 6, endDay: 1, type: "weed-pest" },
  { id: "task_006", name: "Raise Mow Height", month: 6, day: 1, endMonth: 6, endDay: 15, type: "fertilizer" },
  { id: "task_007", name: "Summer Fertilizer", month: 6, day: 15, endMonth: 7, endDay: 1, type: "fertilizer" },
  { id: "task_008", name: "Aeration Prep", month: 8, day: 15, endMonth: 9, endDay: 1, type: "mechanical" },
  { id: "task_009", name: "Core Aerate", month: 9, day: 1, endMonth: 9, endDay: 20, type: "fertilizer" },
  { id: "task_010", name: "Overseed", month: 9, day: 1, endMonth: 9, endDay: 20, type: "fertilizer" },
  { id: "task_011", name: "Fall Fertilizer", month: 10, day: 15, endMonth: 11, endDay: 1, type: "fertilizer" },
  { id: "task_012", name: "Fall Weed Spray", month: 10, day: 1, endMonth: 10, endDay: 20, type: "weed-pest" },
  { id: "task_013", name: "Final Mow", month: 11, day: 1, endMonth: 11, endDay: 15, type: "mechanical" },
  { id: "task_014", name: "Leaf Cleanup", month: 11, day: 15, endMonth: 12, endDay: 1, type: "mechanical" },
];

/* ── Constants ── */

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* ── Helpers ── */

function generateMonthGrid(year: number, month: number): (number | null)[] {
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function getTasksForDay(month: number, day: number): CalendarTask[] {
  const date = new Date(YEAR, month, day);
  return CALENDAR_TASKS.filter((t) => {
    const start = new Date(YEAR, t.month - 1, t.day);
    const end =
      t.endMonth !== undefined && t.endDay !== undefined
        ? new Date(YEAR, t.endMonth - 1, t.endDay)
        : start;
    return date >= start && date <= end;
  });
}

function isBlackoutDay(month: number, day: number): boolean {
  const d = new Date(YEAR, month, day);
  return d >= new Date(YEAR, 3, 1) && d <= new Date(YEAR, 4, 15);
}

function isCurrentDay(month: number, day: number): boolean {
  const t = new Date();
  return t.getFullYear() === YEAR && t.getMonth() === month && t.getDate() === day;
}

function isWeekendDay(month: number, day: number): boolean {
  const dow = new Date(YEAR, month, day).getDay();
  return dow === 0 || dow === 6;
}

function pillBg(type: string): string {
  if (type === "fertilizer") return "bg-lime";
  if (type === "weed-pest") return "bg-orange";
  return "bg-[#4A90D9]";
}

/* ── Component ── */

export default function CalendarPage() {
  const router = useRouter();
  const { isPaid, isFree, isGuest, loading, lawnSqft, grassType } = useUserState();

  // Auto-scroll to current month on mount
  useEffect(() => {
    const currentMonth = document.getElementById(
      `month-${new Date().getMonth() + 1}`
    );
    currentMonth?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Route protection: guest → /, free → /plan
  if (!loading && !isPaid && typeof window !== "undefined") {
    if (isGuest) router.push("/");
    else if (isFree) router.push("/plan");
  }

  const displayGrass = grassType
    ? grassType.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    : "Tall Fescue";

  // Blackout banner logic
  const today = new Date();
  const blackoutStart = new Date(YEAR, 3, 1);
  const blackoutEnd = new Date(YEAR, 4, 15);
  const approachStart = new Date(YEAR, 2, 15);
  const isWithinBlackout = today >= blackoutStart && today <= blackoutEnd;
  const isApproaching = today >= approachStart && today < blackoutStart;
  const daysUntilBlackout = Math.ceil(
    (blackoutStart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <>
      <Nav userState="paid" />

      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Header */}
        <h1 className="font-display text-hero text-forest text-center">
          Your KC Lawn Calendar
        </h1>
        <p className="text-sm text-muted text-center mt-2">
          {lawnSqft
            ? `${lawnSqft.toLocaleString()} sq ft · Zone 6a · ${displayGrass}`
            : `Zone 6a · ${displayGrass}`}
        </p>

        {/* Tab bar */}
        <div className="flex gap-1 mt-6 border-b border-border overflow-x-auto">
          {[
            { label: "Overview", href: "/dashboard", active: false },
            { label: "Checklist", href: "/checklist", active: false },
            { label: "Calendar", href: "/calendar", active: true },
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

        {/* Legend */}
        <div className="flex gap-4 flex-wrap py-3 border-b border-border mb-6">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-lime" />
            <span className="text-xs">Fertilizer</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-orange" />
            <span className="text-xs">Weed &amp; Pest</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#4A90D9]" />
            <span className="text-xs">Mechanical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded bg-orange-light border border-orange/30" />
            <span className="text-xs">JoCo Blackout</span>
          </div>
        </div>

        {/* Blackout banner */}
        {isWithinBlackout && (
          <div
            className="flex items-start gap-2 rounded-lg bg-orange-light p-4 mb-6"
            style={{ borderLeft: "4px solid var(--orange)" }}
          >
            <AlertTriangle size={16} className="text-orange flex-shrink-0 mt-0.5" />
            <p className="text-sm text-charcoal">
              <strong>Johnson County Fertilizer Blackout Active</strong> — Apr 1
              through May 15. No phosphorus applications.
            </p>
          </div>
        )}
        {isApproaching && (
          <div
            className="flex items-start gap-2 rounded-lg bg-lime-light p-4 mb-6"
            style={{ borderLeft: "4px solid var(--lime)" }}
          >
            <AlertTriangle size={16} className="text-lime flex-shrink-0 mt-0.5" />
            <p className="text-sm text-charcoal">
              Johnson County Fertilizer Blackout starts Apr 1 —{" "}
              <strong>{daysUntilBlackout} days away</strong>.
            </p>
          </div>
        )}

        {/* 12-month calendar */}
        <div className="space-y-10">
          {Array.from({ length: 12 }, (_, i) => i).map((monthIdx) => {
            const grid = generateMonthGrid(YEAR, monthIdx);

            return (
              <section key={monthIdx} id={`month-${monthIdx + 1}`}>
                <h2 className="font-display text-2xl text-forest mb-2">
                  {MONTH_NAMES[monthIdx]} {YEAR}
                </h2>

                {/* Day-of-week headers */}
                <div className="grid grid-cols-7">
                  {DAY_HEADERS.map((d) => (
                    <div
                      key={d}
                      className="py-1.5 text-center font-mono text-[11px] text-muted border-b border-border"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7">
                  {grid.map((day, i) => {
                    if (day === null) {
                      return (
                        <div
                          key={`e-${monthIdx}-${i}`}
                          className="min-h-[72px] sm:min-h-[80px] border border-border bg-white/50"
                        />
                      );
                    }

                    const tasks = getTasksForDay(monthIdx, day);
                    const blackout = isBlackoutDay(monthIdx, day);
                    const todayCell = isCurrentDay(monthIdx, day);
                    const weekend = isWeekendDay(monthIdx, day);

                    let cellBg = "bg-white";
                    if (todayCell) cellBg = "bg-forest";
                    else if (blackout) cellBg = "bg-orange-light";
                    else if (tasks.length > 0) cellBg = "bg-cream";
                    else if (weekend) cellBg = "bg-[#FAFAF8]";

                    return (
                      <div
                        key={`d-${monthIdx}-${day}`}
                        className={`min-h-[72px] sm:min-h-[80px] border border-border p-1 ${cellBg}`}
                      >
                        <span
                          className={`font-mono text-xs leading-none ${
                            todayCell ? "text-white font-medium" : "text-charcoal"
                          }`}
                        >
                          {day}
                        </span>
                        {tasks.length > 0 && (
                          <div className="mt-0.5 space-y-0.5">
                            {tasks.slice(0, 3).map((task) => (
                              <div
                                key={task.id}
                                className={`h-5 rounded px-1 font-mono text-[10px] text-white truncate leading-5 ${pillBg(
                                  task.type
                                )}`}
                              >
                                {task.name}
                              </div>
                            ))}
                            {tasks.length > 3 && (
                              <div className="font-mono text-[10px] text-muted pl-0.5">
                                +{tasks.length - 3} more
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
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
