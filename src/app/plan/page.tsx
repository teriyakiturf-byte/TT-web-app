"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UnlockModal from "@/components/ui/UnlockModal";
import { useUserState } from "@/hooks/useUserState";
import { useWeather } from "@/hooks/useWeather";

export default function PlanPage() {
  const router = useRouter();
  const { loading: isLoading, isPaid, lawnSqft, email } = useUserState();
  useWeather();
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && isPaid) router.replace("/dashboard");
  }, [isLoading, isPaid, router]);

  async function handleStripeCheckout() {
    if (checkoutLoading) return;
    setCheckoutLoading(true);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email || undefined,
          lawnSqft: lawnSqft || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.error === "STRIPE_NOT_CONFIGURED") {
          alert("Stripe is not configured yet. Payment will be available soon.");
        }
        setCheckoutLoading(false);
        return;
      }

      const { checkoutUrl } = await res.json();
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch {
      alert("Something went wrong. Please try again.");
      setCheckoutLoading(false);
    }
  }

  if (isLoading) return (
    <div style={{
      minHeight: '100vh',
      background: '#F8F4E9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        border: '3px solid #D8F3DC',
        borderTop: '3px solid #52B788',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
    </div>
  );

  return (
    <>
      <div
        id="sticky-unlock-bar"
        className="fixed bottom-0 left-0 right-0 z-30 bg-forest/95 backdrop-blur-sm border-t border-white/10 px-4 py-3"
      >
        <div className="mx-auto max-w-3xl flex items-center justify-between">
          <div>
            <p className="font-display text-lg text-white">Unlock Your Full Plan</p>
            <p className="font-mono text-xs text-white/60">
              $67 one-time · Lifetime access
            </p>
          </div>
          <button
            onClick={() => setUnlockModalOpen(true)}
            className="rounded-xl bg-orange px-5 py-2.5 font-display text-sm text-white uppercase tracking-wider hover:bg-orange/90 transition-colors"
          >
            Unlock — $67 →
          </button>
        </div>
      </div>

      <UnlockModal
        lawnSqft={lawnSqft ?? undefined}
        isOpen={unlockModalOpen}
        onClose={() => setUnlockModalOpen(false)}
        onStripeCheckout={handleStripeCheckout}
      />
    </>
  );
}
