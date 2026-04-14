"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/components/Nav";
import { Check } from "lucide-react";

export default function ThankYouPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [lawnSqft, setLawnSqft] = useState<number | null>(null);

  useEffect(() => {
    const sqft = localStorage.getItem("tt_sqft");
    if (sqft) setLawnSqft(Number(sqft));
    // Ensure user is marked as paid
    localStorage.setItem("tt_user_state", "paid");
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      router.push("/dashboard");
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, router]);

  return (
    <>
      <Nav userState="paid" />

      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        {/* Success icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-lime">
          <Check size={40} className="text-white" strokeWidth={3} />
        </div>

        <h1 className="font-display text-hero text-forest">
          You&apos;re In!
        </h1>

        <p className="text-lg text-charcoal mt-3">
          Your personalized KC lawn plan is unlocked.
        </p>

        {lawnSqft && (
          <p className="text-sm text-muted mt-2">
            {lawnSqft.toLocaleString()} sq ft · Zone 6a · All tasks & quantities ready
          </p>
        )}

        {/* What you get summary */}
        <div className="mt-8 rounded-xl border border-border bg-white p-6 text-left">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-3">
            What&apos;s included
          </p>
          <ul className="space-y-3">
            {[
              "Week-by-week task schedule for Zone 6a",
              "Product quantities calculated for your lawn size",
              "KC soil temp triggers built into every task",
              "Seasonal alerts and soil temp triggers",
              "Lifetime access — no subscription, no renewals",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check
                  size={16}
                  className="mt-0.5 flex-shrink-0 text-lime"
                  strokeWidth={3}
                />
                <span className="text-sm text-charcoal">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Auto-redirect notice */}
        <div className="mt-8">
          <p className="text-sm text-muted">
            Redirecting to your dashboard in {countdown} seconds...
          </p>
          <a
            href="/dashboard"
            className="mt-3 inline-block rounded-xl bg-lime px-6 py-3 font-display text-lg text-white uppercase tracking-wider hover:bg-lime/90 transition-colors"
          >
            Go to Dashboard Now →
          </a>
        </div>
      </main>
    </>
  );
}
