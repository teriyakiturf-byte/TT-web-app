"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import Nav from "@/components/Nav";
import { useUserState } from "@/hooks/useUserState";

/* ── Task name lookup (shared IDs with calendar) ── */

const TASK_INFO: Record<string, { name: string; type: "fertilizer" | "weed-pest" | "mechanical" }> = {
  task_001: { name: "Pre-Emergent #1", type: "fertilizer" },
  task_002: { name: "First Mow", type: "mechanical" },
  task_003: { name: "Broadleaf Spray", type: "weed-pest" },
  task_004: { name: "Spring Fertilizer", type: "fertilizer" },
  task_005: { name: "Grub Preventative", type: "weed-pest" },
  task_006: { name: "Raise Mow Height", type: "fertilizer" },
  task_007: { name: "Summer Fertilizer", type: "fertilizer" },
  task_008: { name: "Aeration Prep", type: "mechanical" },
  task_009: { name: "Core Aerate", type: "fertilizer" },
  task_010: { name: "Overseed", type: "fertilizer" },
  task_011: { name: "Fall Fertilizer", type: "fertilizer" },
  task_012: { name: "Fall Weed Spray", type: "weed-pest" },
  task_013: { name: "Final Mow", type: "mechanical" },
  task_014: { name: "Leaf Cleanup", type: "mechanical" },
};

function pillBg(type: string): string {
  if (type === "fertilizer") return "bg-lime";
  if (type === "weed-pest") return "bg-orange";
  return "bg-[#4A90D9]";
}

/* ── Milestones data ── */

type MilestoneStatus = "past" | "current" | "upcoming";

interface Milestone {
  id: string;
  month: string;
  name: string;
  isUrgent: boolean;
  isMainEvent: boolean;
  kcContext: string;
  taskIds: string[];
  status: MilestoneStatus;
}

const MILESTONES: Milestone[] = [
  {
    id: "ms_001",
    month: "MARCH",
    name: "Pre-Emergent Application",
    isUrgent: true,
    isMainEvent: false,
    kcContext:
      "The most time-sensitive task of spring. Soil temps crossing 50\u00B0F is your trigger \u2014 not the calendar date. KC soil temps hit this window in mid-March most years. Miss it and crabgrass wins the summer.",
    taskIds: ["task_001"],
    status: "current",
  },
  {
    id: "ms_002",
    month: "JUNE\u2013AUGUST",
    name: "Summer Stress Defense",
    isUrgent: false,
    isMainEvent: false,
    kcContext:
      "KC summers push Tall Fescue to its limits. Mow at 4 inches \u2014 never lower. Water deeply and infrequently (1 inch per week). Watch for brown patch fungus in July humidity. Resist the urge to fertilize during heat stress above 85\u00B0F. Your lawn going semi-dormant in July is normal \u2014 it will recover when temps drop in September.",
    taskIds: ["task_006", "task_007"],
    status: "upcoming",
  },
  {
    id: "ms_003",
    month: "AUGUST",
    name: "Fall Overseeding Prep",
    isUrgent: false,
    isMainEvent: false,
    kcContext:
      "Reserve a core aerator now. September is the #1 month to renovate your KC lawn. Stock up on Tall Fescue seed blend and starter fertilizer. Soil temps are still too high to seed \u2014 but they\u2019re dropping. Be ready to execute the moment the window opens.",
    taskIds: ["task_008"],
    status: "upcoming",
  },
  {
    id: "ms_004",
    month: "SEPTEMBER",
    name: "Fall Overseeding \u2014 THE MAIN EVENT",
    isUrgent: false,
    isMainEvent: true,
    kcContext:
      "The single most important lawn task of the year for KC Tall Fescue. Soil temps between 50\u201365\u00B0F and cooling nights create perfect germination conditions. Core aerate 24\u201348 hours before seeding. Apply starter fertilizer immediately after seed. Water twice daily for 3 weeks. Miss this window and you wait a full year \u2014 this is why we track KC soil temps all summer.",
    taskIds: ["task_008", "task_009", "task_010"],
    status: "upcoming",
  },
  {
    id: "ms_005",
    month: "OCTOBER",
    name: "Fall Fertilizer \u2014 The Most Important Feed",
    isUrgent: false,
    isMainEvent: false,
    kcContext:
      "More impactful than any spring application. Fall fertilizer builds root mass and carbohydrate reserves that carry your lawn through winter and fuel spring green-up. The winterizer application in late October is non-negotiable for a healthy KC lawn.",
    taskIds: ["task_011"],
    status: "upcoming",
  },
  {
    id: "ms_006",
    month: "NOVEMBER",
    name: "Winter Prep & Equipment Storage",
    isUrgent: false,
    isMainEvent: false,
    kcContext:
      "Final mow at 3\u2033, equipment winterization, and a clean lawn going into dormancy. KC winters are mild enough that late-season disease (snow mold) is a real risk if grass goes in too tall. End the season clean.",
    taskIds: ["task_013", "task_014"],
    status: "upcoming",
  },
];

/* ── Component ── */

export default function MilestonesPage() {
  const router = useRouter();
  const { isPaid, isFree, isGuest, loading, lawnSqft, grassType } = useUserState();

  // Route protection: guest → /, free → /plan
  if (!loading && !isPaid && typeof window !== "undefined") {
    if (isGuest) router.push("/");
    else if (isFree) router.push("/plan");
  }

  const displayGrass = grassType
    ? grassType.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    : "Tall Fescue";

  return (
    <>
      <Nav userState="paid" />

      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Header */}
        <h1 className="font-display text-hero text-forest text-center">
          KC Lawn Milestones
        </h1>
        <p className="text-sm text-muted text-center mt-2">
          {lawnSqft
            ? `${lawnSqft.toLocaleString()} sq ft · Zone 6a · ${displayGrass}`
            : `Zone 6a · ${displayGrass}`}
        </p>
        <p className="text-sm text-muted text-center mt-1">
          6 key moments that define your lawn year
        </p>

        {/* Timeline */}
        <div className="mt-10">
          {MILESTONES.map((ms, i) => {
            const isLast = i === MILESTONES.length - 1;

            return (
              <div key={ms.id} className="flex gap-4">
                {/* Timeline column: dot + line */}
                <div className="flex flex-col items-center w-7 flex-shrink-0">
                  {/* Dot */}
                  <div
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      ms.status === "past"
                        ? "bg-lime border-lime"
                        : ms.status === "current"
                        ? "bg-lime border-lime milestone-dot--current"
                        : "bg-white border-border"
                    }`}
                  >
                    {ms.status === "past" && (
                      <Check size={14} className="text-white" strokeWidth={3} />
                    )}
                    {ms.status === "current" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    )}
                  </div>

                  {/* Connecting line */}
                  {!isLast && <div className="flex-1 w-px bg-border" />}
                </div>

                {/* Card */}
                <div className="flex-1 pb-8">
                  <div
                    className={`rounded-xl border p-4 sm:p-5 ${
                      ms.isMainEvent
                        ? "border-lime border-2 bg-lime-light"
                        : "border-border bg-white"
                    }`}
                  >
                    {/* Month + badges */}
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
                        {ms.month}
                      </span>
                      <div className="flex gap-1.5">
                        {ms.isUrgent && (
                          <span className="rounded-full bg-orange px-2.5 py-0.5 font-mono text-[10px] text-white uppercase tracking-wider">
                            Urgent
                          </span>
                        )}
                        {ms.isMainEvent && (
                          <span className="rounded-full bg-forest px-2.5 py-0.5 font-mono text-[10px] text-white uppercase tracking-wider">
                            Main Event
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Name */}
                    <h3
                      className={`font-display text-xl text-forest ${
                        ms.isMainEvent ? "text-2xl" : ""
                      }`}
                    >
                      {ms.name}
                    </h3>

                    {/* KC Context */}
                    <p className="text-sm text-muted mt-2 leading-relaxed">
                      {ms.kcContext}
                    </p>

                    {/* Task tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {ms.taskIds.map((taskId) => {
                        const info = TASK_INFO[taskId];
                        if (!info) return null;
                        return (
                          <span
                            key={taskId}
                            className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] text-white ${pillBg(
                              info.type
                            )}`}
                          >
                            {info.name}
                          </span>
                        );
                      })}
                    </div>

                    {/* View Tasks link */}
                    <Link
                      href="/checklist"
                      className="inline-flex items-center gap-1 text-sm text-lime hover:text-forest mt-3 transition-colors"
                    >
                      View Tasks →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Back to dashboard */}
        <div className="mt-4 mb-8 text-center">
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
