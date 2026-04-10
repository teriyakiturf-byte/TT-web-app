"use client";

import { Check } from "lucide-react";
import type { Season, SeasonStatus } from "@/types";

interface SeasonPillProps {
  season: Season;
  status: SeasonStatus;
  completionPercent?: number;
  taskCount?: number;
  startDate?: string;
}

const seasonLabels: Record<Season, string> = {
  spring: "Spring",
  summer: "Summer",
  fall: "Fall",
  winter: "Winter",
};

export default function SeasonPill({
  season,
  status,
  completionPercent,
  taskCount,
  startDate,
}: SeasonPillProps) {
  return (
    <div
      className={`flex-1 rounded-xl p-3 text-center ${
        status === "past"
          ? "bg-forest text-white"
          : status === "current"
          ? "border-2 border-lime bg-white"
          : "bg-white text-muted border border-border"
      }`}
    >
      <p className="font-display text-lg">{seasonLabels[season]}</p>

      {status === "past" && (
        <div className="flex items-center justify-center gap-1 mt-1">
          <Check size={14} />
          <span className="font-mono text-xs">
            {completionPercent ?? 100}%
          </span>
        </div>
      )}

      {status === "current" && (
        <div className="mt-2">
          <div className="h-1.5 rounded-full bg-lime-light overflow-hidden">
            <div
              className="h-full rounded-full bg-lime transition-all"
              style={{ width: `${completionPercent ?? 0}%` }}
            />
          </div>
          {taskCount !== undefined && (
            <p className="font-mono text-[10px] text-muted mt-1">
              {taskCount} tasks left
            </p>
          )}
        </div>
      )}

      {status === "future" && startDate && (
        <p className="font-mono text-[10px] mt-1">{startDate}</p>
      )}
    </div>
  );
}
