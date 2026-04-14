"use client";

import { Thermometer, Calendar } from "lucide-react";
import type { ComplianceBadgeType } from "@/types";

interface KCComplianceBadgeProps {
  type: ComplianceBadgeType;
}

const badgeConfig: Record<
  ComplianceBadgeType,
  { text: string; bg: string; color: string; icon?: React.ReactNode; font?: string }
> = {
  "soil-temp-triggered": {
    text: "Soil Temp Triggered",
    bg: "bg-lime-light",
    color: "text-forest",
    icon: <Thermometer size={10} className="flex-shrink-0" />,
  },
  "apply-before-may": {
    text: "Apply Before May 1",
    bg: "bg-orange-light",
    color: "text-forest",
    icon: <Calendar size={10} className="flex-shrink-0" />,
  },
  "slow-release-safe": {
    text: "Slow Release \u2713",
    bg: "bg-lime-light",
    color: "text-forest",
  },
  "summer-window": {
    text: "Summer Window",
    bg: "bg-lime-light",
    color: "text-forest",
  },
  "main-event": {
    text: "\u2B50 The Main Event",
    bg: "bg-orange",
    color: "text-white",
    font: "font-display",
  },
  "fall-window": {
    text: "Fall Window",
    bg: "bg-lime-light",
    color: "text-forest",
  },
  "apply-before-frost": {
    text: "Apply Before Frost",
    bg: "bg-orange-light",
    color: "text-forest",
  },
};

export default function KCComplianceBadge({ type }: KCComplianceBadgeProps) {
  const cfg = badgeConfig[type];
  if (!cfg) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full ${cfg.bg} px-2 py-0.5 ${
        cfg.font ?? "font-mono"
      } text-[10px] ${cfg.color}`}
    >
      {cfg.icon}
      {cfg.text}
    </span>
  );
}
