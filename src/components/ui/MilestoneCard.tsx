"use client";

import { Check, ArrowRight } from "lucide-react";
import type { MilestoneStatus } from "@/types";

interface MilestoneCardProps {
  monthLabel: string;
  milestoneName: string;
  kcContext: string;
  taskTags: string[];
  status: MilestoneStatus;
  isUrgent?: boolean;
  isMainEvent?: boolean;
  onViewTasks: () => void;
}

export default function MilestoneCard({
  monthLabel,
  milestoneName,
  kcContext,
  taskTags,
  status,
  isUrgent,
  isMainEvent,
  onViewTasks,
}: MilestoneCardProps) {
  return (
    <div
      className={`relative rounded-xl border p-5 transition-all ${
        status === "completed"
          ? "border-forest bg-white"
          : status === "current"
          ? "border-2 border-lime bg-white shadow-sm"
          : "border-border bg-white/60 text-muted"
      } ${isMainEvent ? "border-2 border-orange shadow-md" : ""}`}
    >
      {isUrgent && (
        <span className="absolute -left-2 top-4 h-3 w-3 rounded-full bg-orange" />
      )}

      {isMainEvent && (
        <span className="inline-block font-mono text-[10px] uppercase tracking-widest text-orange bg-orange-light rounded-full px-3 py-0.5 mb-2">
          The Main Event
        </span>
      )}

      <p className="font-mono text-xs text-muted uppercase tracking-wide">
        {monthLabel}
      </p>
      <h3 className="font-display text-xl text-forest mt-1">{milestoneName}</h3>
      <p className="text-sm text-charcoal/80 mt-2 leading-relaxed">
        {kcContext}
      </p>

      {taskTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {taskTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-lime-light px-2 py-0.5 font-mono text-[10px] text-forest"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {status === "completed" && (
        <div className="flex items-center gap-1 mt-3 text-forest">
          <Check size={14} strokeWidth={3} />
          <span className="font-mono text-xs">Complete</span>
        </div>
      )}

      {status !== "completed" && (
        <button
          onClick={onViewTasks}
          className="mt-3 inline-flex items-center gap-1 text-sm text-lime hover:text-forest transition-colors"
        >
          See Tasks <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
}
