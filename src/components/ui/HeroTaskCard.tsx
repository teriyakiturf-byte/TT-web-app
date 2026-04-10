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
  onUnlockClick?: () => void;
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
  onUnlockClick,
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
      className={`relative rounded-2xl bg-forest p-6 text-white ${border} ${
        isBlurred ? "soft-gate-content" : ""
      }`}
    >
      {isLocked ? (
        <>
          {/* Card content rendered behind overlay */}
          <div className="opacity-30">
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
            <p className="text-sm text-white/70 mt-2">{applicationNotes}</p>
          </div>

          {/* Dark overlay */}
          <div
            className="absolute inset-0 rounded-2xl z-[5]"
            style={{
              background: 'rgba(27, 67, 50, 0.85)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          />

          {/* Unlock CTA above overlay */}
          <div className="relative z-10 mt-4 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <Lock size={20} className="text-white" />
            </div>
            <p className="font-mono text-sm text-white/70">
              Unlock to see your exact quantity
            </p>
            {tier !== 4 && (
              <button
                onClick={onUnlockClick}
                className="mt-3 w-full rounded-xl bg-orange px-6 py-3 font-display text-lg text-white uppercase tracking-wider hover:bg-orange/90 transition-colors"
              >
                Unlock My Lawn Plan — $67 →
              </button>
            )}
          </div>
        </>
      ) : (
        <>
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
          <p className="font-mono text-xl text-lime font-medium mt-3">
            {calculatedQuantity}
          </p>
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
        </>
      )}
    </div>
  );
}
