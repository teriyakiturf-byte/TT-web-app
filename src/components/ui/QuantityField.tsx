"use client";

import { Lock } from "lucide-react";
import { calculateQuantity } from "@/types";

interface QuantityFieldProps {
  isPaid: boolean;
  lawnSqft: number | null;
  labelRate: number;
  unit?: string;
  onUnlockClick?: () => void;
}

export default function QuantityField({
  isPaid,
  lawnSqft,
  labelRate,
  unit = "lbs",
  onUnlockClick,
}: QuantityFieldProps) {
  // Mechanical tasks with no product rate
  if (labelRate === 0) {
    return <span className="font-mono text-xs text-muted">—</span>;
  }

  // STATE A: Guest or Free — locked
  if (!isPaid) {
    return (
      <button
        onClick={onUnlockClick}
        className="inline-flex items-center gap-1 rounded-full bg-lime-light px-2.5 py-0.5 font-mono text-xs text-muted hover:bg-lime/20 transition-colors cursor-pointer"
      >
        <Lock size={12} />
        Unlock quantities
      </button>
    );
  }

  // STATE B: Paid but no valid lawn size
  if (
    lawnSqft === null ||
    lawnSqft === undefined ||
    isNaN(lawnSqft) ||
    lawnSqft <= 0
  ) {
    return (
      <a
        href="/measure"
        className="font-mono text-xs text-lime hover:text-forest transition-colors"
      >
        Add your lawn size →
      </a>
    );
  }

  // STATE C: Paid with valid lawn size — calculated
  const qty = calculateQuantity(lawnSqft, labelRate);

  return (
    <span className="font-mono text-xs text-lime font-medium">
      {qty.toFixed(1)} {unit}
    </span>
  );
}
