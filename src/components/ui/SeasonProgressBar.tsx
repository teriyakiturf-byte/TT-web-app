"use client";

import type { SeasonStatusLevel } from "@/lib/planTasks";

interface SeasonProgressBarProps {
  completedCount: number;
  totalDueTasks: number;
  /** 0–100, already capped. */
  percentage: number;
  status: SeasonStatusLevel;
  /** Due-but-incomplete count, shown in the "behind" caption. */
  overdueCount: number;
}

/**
 * Dashboard season-progress bar: % of seasonal tasks due so far that are
 * complete, with on-track / ahead / behind messaging beneath. Design per #30.
 */
export default function SeasonProgressBar({
  completedCount,
  totalDueTasks,
  percentage,
  status,
  overdueCount,
}: SeasonProgressBarProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold text-[#1B4332] uppercase tracking-wide">
          Season Progress
        </span>
        <span className="text-xs text-gray-500">
          {completedCount} of {totalDueTasks} tasks complete
        </span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
        <div
          className="bg-[#52B788] rounded-full h-2 transition-all duration-700"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {status === "ahead" && (
        <p className="text-xs text-[#52B788]">
          {"You're ahead of most KC homeowners at this point in the season."}
        </p>
      )}
      {status === "on-track" && (
        <p className="text-xs text-gray-400">
          {"You're on pace with the KC lawn calendar."}
        </p>
      )}
      {status === "behind" && (
        <p className="text-xs text-gray-400">
          {`You have ${overdueCount} overdue tasks. Here's what to do first:`}
        </p>
      )}
    </div>
  );
}
