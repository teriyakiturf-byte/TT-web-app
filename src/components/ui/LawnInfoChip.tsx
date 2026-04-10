"use client";

import type { LawnInfoChipType } from "@/types";

interface LawnInfoChipProps {
  type: LawnInfoChipType;
  value: string;
}

const labels: Record<LawnInfoChipType, string> = {
  "lawn-size": "Lawn Size",
  "grass-type": "Grass Type",
  zone: "Zone",
  soil: "Soil",
};

export default function LawnInfoChip({ type, value }: LawnInfoChipProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-light px-3 py-1 text-xs font-mono text-forest">
      <span className="uppercase tracking-wide opacity-70">{labels[type]}</span>
      <span className="font-medium">{value}</span>
    </span>
  );
}
