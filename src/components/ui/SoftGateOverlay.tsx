"use client";

import { Lock } from "lucide-react";

interface SoftGateOverlayProps {
  onUnlockClick: () => void;
  lawnSqft?: number;
}

export default function SoftGateOverlay({
  onUnlockClick,
  lawnSqft,
}: SoftGateOverlayProps) {
  return (
    <div
      className="soft-gate-overlay cursor-pointer rounded-2xl"
      onClick={onUnlockClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onUnlockClick()}
      aria-label="Unlock your KC lawn plan"
    >
      <div className="text-center px-6 max-w-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
          <Lock size={24} className="text-white" />
        </div>
        <h3 className="font-display text-2xl text-white uppercase">
          Your KC Lawn Plan Is Ready
        </h3>
        <p className="text-sm text-white/80 mt-2">
          Week-by-week tasks. Exact product quantities.
          {lawnSqft
            ? ` Built for your ${lawnSqft.toLocaleString()} sq ft Zone 6a lawn.`
            : " Built for your Zone 6a lawn."}
        </p>
        <button className="mt-4 w-full rounded-xl bg-orange px-6 py-3 font-display text-lg text-white uppercase tracking-wider hover:bg-orange/90 transition-colors">
          Unlock My Lawn Plan — $47/year →
        </button>
        <p className="font-mono text-[10px] text-white/50 mt-2">
          Billed annually · Cancel anytime
        </p>
      </div>
    </div>
  );
}
