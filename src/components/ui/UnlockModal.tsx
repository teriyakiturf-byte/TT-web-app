"use client";

import { useEffect, useRef, useState } from "react";
import { X, Loader2 } from "lucide-react";

interface UnlockModalProps {
  lawnSqft?: number;
  isOpen: boolean;
  onClose: () => void;
  onStripeCheckout: () => void;
}

export default function UnlockModal({
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

        {/* Savings delta headline (#5) */}
        <p className="text-lg font-semibold text-[#2C3E50]">
          You just built a lawn plan that TruGreen would charge you $780/year to
          execute.
        </p>
        <p className="text-2xl font-bold text-[#F4631E]">
          Unlock it for $67. Once. Never again.
        </p>

        {/* One-time payment badge (#6) */}
        <div className="flex items-center justify-center gap-2 bg-[#EAFAF1] border border-[#52B788] rounded-full px-4 py-2 my-3 w-full md:w-auto md:mx-auto">
          <span className="text-sm font-bold text-[#1B4332] text-center">
            ✅  ONE-TIME PAYMENT. NOT A SUBSCRIPTION. NOT EVER.
          </span>
        </div>

        {/* What unlocks feature list */}
        <div className="space-y-3 my-4">
          {[
            {
              emoji: "🌿",
              title: "Exact product names",
              sub: "The specific fertilizers, pre-emergents & amendments for KC clay soil. No guessing at Home Depot.",
            },
            {
              emoji: "⚖️",
              title: "Precise quantities",
              sub: "Calibrated to your exact lawn size. Over-apply = burned grass. Under-apply = weeds win.",
            },
            {
              emoji: "📅",
              title: "Week-by-week timing",
              sub: "Not early spring. The actual dates for your ZIP based on real KC soil temperature data.",
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-3 items-start">
              <span className="text-xl mt-0.5">{item.emoji}</span>
              <div>
                <p className="font-bold text-sm text-[#1B4332]">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial (#7) */}
        <div className="bg-[#F5F1E8] rounded-xl p-4 border-l-4 border-[#F4631E] my-3">
          <p className="text-sm italic text-[#2C3E50]">
            &ldquo;I cancelled Ryan Lawn after my second month. My lawn has never
            looked this good — and I actually understand why it looks this
            good.&rdquo;
          </p>
          <p className="text-xs text-gray-500 mt-2">
            — Marcus T., Overland Park, KS
          </p>
        </div>

        {/* Risk reversal (#27) */}
        <div className="text-center my-2">
          <p className="text-xs text-gray-400">
            Not happy with your plan? Email us. We will make it right. This is
            Trever&apos;s personal system — we stand behind it.
          </p>
        </div>

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
            "Unlock My Full Plan — $67"
          )}
        </button>

        {/* Button micro-copy */}
        <p className="text-xs text-gray-400 text-center mt-2">
          Secure checkout via Stripe. One-time. No subscription. Instant access.
        </p>
      </div>
    </div>
  );
}
