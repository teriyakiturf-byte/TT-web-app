"use client";

import { Lock } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  subtitle?: string;
  isLocked?: boolean;
}

export default function StatCard({
  label,
  value,
  subtitle,
  isLocked,
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
          {subtitle && (
            <p className="text-xs text-muted mt-0.5">{subtitle}</p>
          )}
        </>
      )}
    </div>
  );
}
