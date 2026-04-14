"use client";

import { useEffect, useRef, useState } from "react";
import { X, Check, Loader2 } from "lucide-react";

interface UnlockModalProps {
  lawnSqft?: number;
  isOpen: boolean;
  onClose: () => void;
  onStripeCheckout: () => void;
}

export default function UnlockModal({
  lawnSqft,
  isOpen,
  onClose,
  onStripeCheckout,
}: UnlockModalProps) {
  const [loading, setLoading] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 px-4"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted hover:text-charcoal"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2 className="font-display text-3xl text-forest uppercase">
          {lawnSqft
            ? `Your ${lawnSqft.toLocaleString()} Sq Ft KC Lawn Plan`
            : "Your KC Lawn Plan"}
        </h2>

        <p className="font-display text-[72px] leading-none text-forest mt-4">
          $67
        </p>
        <p className="font-mono text-xs text-muted mt-1">
          One-time payment · Lifetime access
        </p>

        <ul className="mt-5 space-y-3">
          {[
            "Week-by-week schedule built for Zone 6a",
            "Product quantities calculated for your exact lawn size",
            "Fall overseeding window calculated from KC soil temps",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check
                size={18}
                className="mt-0.5 flex-shrink-0 text-lime"
                strokeWidth={3}
              />
              <span className="text-sm text-charcoal">{item}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={() => {
            setLoading(true);
            onStripeCheckout();
          }}
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-orange px-6 py-4 font-display text-xl text-white uppercase tracking-wider hover:bg-orange/90 transition-colors disabled:opacity-70"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 size={20} className="animate-spin" />
              Redirecting to Checkout…
            </span>
          ) : (
            "Unlock My KC Lawn Plan — $67 →"
          )}
        </button>

        <p className="font-mono text-[10px] text-muted text-center mt-3">
          One-time payment. Lifetime access. No subscription. No renewals. Ever.
        </p>
      </div>
    </div>
  );
}
