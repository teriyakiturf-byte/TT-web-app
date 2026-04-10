"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Lock } from "lucide-react";
import type { TaskTier } from "@/types";

interface HeroTaskCardProps {
  taskName: string;
  productName: string;
  calculatedQuantity: string;
  applicationNotes: string;
  tier: TaskTier;
  isBlurred?: boolean;
  isLocked?: boolean;
  onMarkComplete: () => void;
  onSnooze: () => void;
  onSkip: () => void;
  snoozeCount: number;
  whyContext?: string;
}

const tierConfig: Record<
  TaskTier,
  { border: string; badge?: string; badgeColor: string }
> = {
  1: {
    border: "border-4 border-orange",
    badge: "DEADLINE APPROACHING",
    badgeColor: "bg-orange text-white",
  },
  2: {
    border: "border-4 border-lime",
    badge: "CONDITIONS ARE RIGHT",
    badgeColor: "bg-lime text-white",
  },
  3: { border: "", badge: undefined, badgeColor: "" },
  4: {
    border: "opacity-70",
    badge: "COMING UP NEXT",
    badgeColor: "bg-white/20 text-white/80",
  },
  5: { border: "", badge: undefined, badgeColor: "" },
};

export default function HeroTaskCard({
  taskName,
  productName,
  calculatedQuantity,
  applicationNotes,
  tier,
  isBlurred,
  isLocked,
  onMarkComplete,
  onSnooze,
  onSkip,
  snoozeCount,
  whyContext,
}: HeroTaskCardProps) {
  const [whyExpanded, setWhyExpanded] = useState(false);
  const { border, badge, badgeColor } = tierConfig[tier];

  if (tier === 5) {
    return (
      <div
        className={`rounded-2xl bg-forest p-6 text-white ${
          isBlurred ? "soft-gate-content" : ""
        }`}
      >
        <p className="font-display text-2xl">No Active Tasks</p>
        <p className="text-sm text-white/70 mt-2">
          Your lawn is in great shape. Next task opens soon — enjoy the
          downtime.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl bg-forest p-6 text-white ${border} ${
        isBlurred ? "soft-gate-content" : ""
      }`}
    >
      {badge && (
        <span
          className={`inline-block font-mono text-[10px] uppercase tracking-widest ${badgeColor} rounded-full px-3 py-1 mb-3`}
        >
          {badge}
        </span>
      )}

      <h2 className="font-display text-3xl text-white leading-tight">
        {taskName}
      </h2>
      <p className="font-mono text-sm text-lime mt-1">{productName}</p>
      {isLocked ? (
        <p className="inline-flex items-center gap-2 font-mono text-sm text-white/50 mt-3">
          <Lock size={14} />
          Unlock to see your exact quantity
        </p>
      ) : (
        <p className="font-mono text-xl text-lime font-medium mt-3">
          {calculatedQuantity}
        </p>
      )}
      <p className="text-sm text-white/70 mt-2">{applicationNotes}</p>

      {tier !== 4 && (
        <div className="mt-5 space-y-2">
          <button
            onClick={onMarkComplete}
            className="w-full rounded-xl bg-orange px-6 py-3 font-display text-lg text-white uppercase tracking-wider hover:bg-orange/90 transition-colors"
          >
            Mark Complete
          </button>
          <div className="flex items-center justify-center gap-4">
            {snoozeCount < 2 && (
              <button
                onClick={onSnooze}
                className="text-xs text-white/50 hover:text-white/80 transition-colors"
              >
                Snooze 7 Days
              </button>
            )}
            <button
              onClick={onSkip}
              className="text-xs text-white/50 hover:text-white/80 transition-colors"
            >
              Skip This Task
            </button>
          </div>
        </div>
      )}

      {whyContext && (
        <div className="mt-4 border-t border-white/10 pt-3">
          <button
            onClick={() => setWhyExpanded(!whyExpanded)}
            className="flex items-center gap-1 text-xs text-white/60 hover:text-white/80"
          >
            Why This Task?
            {whyExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {whyExpanded && (
            <p className="text-sm text-white/60 mt-2 leading-relaxed">
              {whyContext}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
