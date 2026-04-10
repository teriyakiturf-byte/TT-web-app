"use client";

import { Check, Lock } from "lucide-react";
import KCComplianceBadge from "./KCComplianceBadge";
import type { ComplianceBadgeType } from "@/types";

interface TaskRowProps {
  taskName: string;
  productName: string;
  quantity: string;
  dueDate: string;
  isComplete: boolean;
  isLocked?: boolean;
  complianceBadges?: ComplianceBadgeType[];
  onToggle: () => void;
}

export default function TaskRow({
  taskName,
  productName,
  quantity,
  dueDate,
  isComplete,
  isLocked,
  complianceBadges,
  onToggle,
}: TaskRowProps) {
  return (
    <div
      className={`flex items-start gap-3 rounded-lg border border-border bg-white px-4 py-3 transition-opacity ${
        isComplete ? "opacity-50" : ""
      }`}
    >
      <button
        onClick={onToggle}
        disabled={isLocked}
        className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-colors ${
          isComplete
            ? "border-lime bg-lime text-white"
            : "border-border hover:border-lime"
        }`}
        aria-label={isComplete ? "Mark incomplete" : "Mark complete"}
      >
        {isComplete && <Check size={12} strokeWidth={3} />}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium ${
            isComplete ? "line-through text-muted" : "text-charcoal"
          }`}
        >
          {taskName}
        </p>
        <p className="font-mono text-xs text-forest mt-0.5">{productName}</p>

        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {isLocked ? (
            <span className="inline-flex items-center gap-1 font-mono text-xs text-muted">
              <Lock size={12} /> Unlock quantities
            </span>
          ) : (
            <span className="font-mono text-xs text-lime font-medium">
              {quantity}
            </span>
          )}
          <span className="font-mono text-[10px] text-muted">{dueDate}</span>
        </div>

        {complianceBadges && complianceBadges.length > 0 && (
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {complianceBadges.map((badge) => (
              <KCComplianceBadge key={badge} type={badge} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
