"use client";

import type { ComplianceBadgeType } from "@/types";

interface KCComplianceBadgeProps {
  type: ComplianceBadgeType;
}

const badgeText: Record<ComplianceBadgeType, string> = {
  "blackout-compliant": "Blackout Compliant ✓",
  "no-phosphorus": "No Phosphorus ✓",
  "joco-law": "JoCo Law",
};

export default function KCComplianceBadge({ type }: KCComplianceBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full bg-lime-light px-2 py-0.5 font-mono text-[10px] text-forest">
      {badgeText[type]}
    </span>
  );
}
