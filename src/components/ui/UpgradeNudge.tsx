"use client";

import { Lock, X } from "lucide-react";

interface UpgradeNudgeProps {
  headline: string;
  body: string;
  onUnlockClick: () => void;
  onDismiss?: () => void;
}

export default function UpgradeNudge({
  headline,
  body,
  onUnlockClick,
  onDismiss,
}: UpgradeNudgeProps) {
  return (
    <div className="relative rounded-xl border border-lime bg-cream border-l-4 border-l-orange p-5">
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute right-3 top-3 text-muted hover:text-charcoal"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      )}

      <div className="flex items-start gap-3">
        <Lock size={20} className="mt-0.5 flex-shrink-0 text-orange" />
        <div>
          <h4 className="font-display text-lg text-forest uppercase">
            {headline}
          </h4>
          <p className="text-sm text-charcoal/80 mt-1">{body}</p>
          <button
            onClick={onUnlockClick}
            className="mt-3 rounded-xl bg-orange px-5 py-2 font-display text-sm text-white uppercase tracking-wider hover:bg-orange/90 transition-colors"
          >
            Unlock for $47/year →
          </button>
        </div>
      </div>
    </div>
  );
}
