"use client";

import { Lock } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  subtitle?: string;
  isLocked?: boolean;
  /** 0–100 progress bar shown below value */
  progress?: number;
}

export default function StatCard({
  label,
  value,
  subtitle,
  isLocked,
  progress,
}: StatCardProps) {
  return (
    <div className="min-w-[140px] flex-shrink-0 rounded-xl border border-border bg-white p-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">
        {label}
      </p>
      {isLocked ? (
        <div className="flex items-center gap-2 text-muted">
          <Lock size={16} />
          <span className="font-mono text-sm">Locked</span>
        </div>
      ) : (
        <>
          <p className="font-display text-stat text-forest">{value}</p>
          {progress !== undefined && (
            <div className="h-1.5 rounded-full bg-lime-light overflow-hidden mt-1.5">
              <div
                className="h-full rounded-full bg-lime transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          )}
          {subtitle && (
            <p className="text-xs text-muted mt-0.5">{subtitle}</p>
          )}
        </>
      )}
    </div>
  );
}
