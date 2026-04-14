"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import Nav from "@/components/Nav";
import SoftGateOverlay from "@/components/ui/SoftGateOverlay";
import UnlockModal from "@/components/ui/UnlockModal";
import HeroTaskCard from "@/components/ui/HeroTaskCard";
import TaskRow from "@/components/ui/TaskRow";
import StatCard from "@/components/ui/StatCard";
import SeasonPill from "@/components/ui/SeasonPill";
import UpgradeNudge from "@/components/ui/UpgradeNudge";
import { useUserState } from "@/hooks/useUserState";

const SAMPLE_TASKS = [
  {
    id: "1",
    name: "Apply Pre-Emergent (Split App #1)",
    product: "Prodiamine 65 WDG",
    labelRate: 0.86,
    due: "Mar 15 – Apr 1",
    badges: ["blackout-compliant" as const, "joco-law" as const],
  },
  {
    id: "2",
    name: "First Mow — Set Height to 3.5″",
    product: "Mower blade sharpened",
    labelRate: 0,
    due: "When grass hits 4″",
    badges: [],
  },
  {
    id: "3",
    name: "Broadleaf Weed Spray",
    product: "Trimec Classic",
    labelRate: 0.42,
    due: "Apr 15 – May 1",
    badges: ["no-phosphorus" as const],
  },
  {
    id: "4",
    name: "Spring Fertilizer Application",
    product: "Milorganite 6-4-0",
    labelRate: 32,
    due: "May 1 – May 15",
    badges: ["blackout-compliant" as const],
  },
  {
    id: "5",
    name: "Grub Preventative",
    product: "GrubEx (Chlorantraniliprole)",
    labelRate: 1.1,
    due: "May 15 – Jun 1",
    badges: [],
  },
];

function formatQuantity(
  isPaid: boolean,
  lawnSqft: number | null,
  labelRate: number
): string {
  if (!isPaid) return "";
  if (labelRate === 0) return "—";
  if (!lawnSqft) return "Add your lawn size →";
  return `${(Math.round(((lawnSqft / 1000) * labelRate) * 10) / 10)} lbs`;
}

export default function PlanPage() {
  const [showModal, setShowModal] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const { isPaid, isFree, isGuest, lawnSqft, email } = useUserState();

  const navState = isPaid ? "paid" : isFree ? "free" : "guest";
  const userState = isPaid ? "paid" as const : isFree ? "free" as const : "guest" as const;

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
          // Stripe not set up yet — fallback to stub
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

  return (
    <>
      <Nav userState={navState} />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="font-display text-hero text-forest text-center">
          Your KC Lawn Plan
        </h1>
        <p className="text-sm text-muted text-center mt-2">
          {lawnSqft && !isGuest
            ? `${lawnSqft.toLocaleString()} sq ft · Zone 6a · Tall Fescue`
            : "Zone 6a · Kansas City Metro"}
        </p>

        {/* Year at a Glance — Season Pills */}
        <div className="flex gap-2 mt-6">
          <SeasonPill season="spring" status="current" completionPercent={25} taskCount={8} />
          <SeasonPill season="summer" status="future" startDate="Jun 1" />
          <SeasonPill season="fall" status="future" startDate="Sep 1" />
          <SeasonPill season="winter" status="future" startDate="Nov 15" />
        </div>

        {/* Lawn Info Chips — always visible, never blurred */}
        <div className="flex flex-wrap gap-2 justify-center my-4 mb-6">
          <span className="inline-flex items-center gap-1 rounded-full bg-lime-light px-2.5 py-1 font-mono text-xs text-forest">
            Zone 6a — KC Metro
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-lime-light px-2.5 py-1 font-mono text-xs text-forest">
            KC Heavy Clay Soil
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-lime-light px-2.5 py-1 font-mono text-xs text-forest">
            Tall Fescue
          </span>
          {lawnSqft && !isGuest ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-lime-light px-2.5 py-1 font-mono text-xs text-forest">
              {lawnSqft.toLocaleString()} sq ft
            </span>
          ) : (
            <a
              href="/measure"
              className="inline-flex items-center gap-1 rounded-full bg-lime-light px-2.5 py-1 font-mono text-xs text-forest hover:bg-lime/30 transition-colors"
            >
              Add your size →
            </a>
          )}
        </div>

        {/* Free account orientation banner */}
        {isFree && (
          <div
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-lime bg-lime-light p-4 mb-5"
            style={{ borderLeftWidth: "4px" }}
          >
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-lime flex-shrink-0" />
              <p className="font-display text-[16px] text-forest">
                Free Preview — Task Names & Products Visible
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="rounded-full bg-orange px-4 py-1.5 font-display text-xs text-white uppercase tracking-wider hover:bg-orange/90 transition-colors whitespace-nowrap"
            >
              Unlock Full Plan — $67 →
            </button>
          </div>
        )}

        {/* Blurred content section — full blur for guests only */}
        <div className="relative mt-8">
          {isGuest && (
            <SoftGateOverlay
              onUnlockClick={() => setShowModal(true)}
              lawnSqft={lawnSqft ?? undefined}
            />
          )}

          <div className={isGuest ? "soft-gate-content" : ""}>
            {/* Hero Task Card */}
            <HeroTaskCard
              taskName="Apply Pre-Emergent (Split App #1)"
              productName="Prodiamine 65 WDG"
              calculatedQuantity={formatQuantity(isPaid, lawnSqft, 0.86)}
              applicationNotes="Apply when soil temps reach 50–55°F consistently. Water in within 24 hours."
              tier={1}
              isBlurred={false}
              userState={userState}
              lawnSqft={lawnSqft}
              onMarkComplete={() => {}}
              onSnooze={() => {}}
              onSkip={() => {}}
              onUnlockClick={() => setShowModal(true)}
              snoozeCount={0}
              whyContext="Soil temps in KC are crossing 55°F — your crabgrass pre-emergent window is closing. Prodiamine creates a chemical barrier that prevents crabgrass seeds from germinating."
            />

            {/* Stats Row */}
            <div className="flex gap-3 mt-6 overflow-x-auto pb-2">
              {isFree ? (
                <>
                  <StatCard label="Current Season" value="Spring" subtitle="8 tasks this season" />
                  <StatCard label="Saved vs. Pro" value="~$187–$746/yr" subtitle="vs. TruGreen avg" />
                </>
              ) : (
                <>
                  <StatCard label="Tasks Done" value="0 / 14" subtitle="Spring: 0 of 5" isLocked={isGuest} />
                  <StatCard label="Saved vs. Pro" value="Save ~$187–$746/yr" subtitle="vs. TruGreen" />
                  <StatCard label="Next Task" value="Apr 15" subtitle="Broadleaf spray" isLocked={isGuest} />
                </>
              )}
            </div>

            {/* Upcoming Tasks */}
            <div className="mt-6">
              <h2 className="font-display text-xl text-forest mb-3">
                Upcoming Tasks
              </h2>
              <div className="space-y-2">
                {SAMPLE_TASKS.map((task) => (
                  <TaskRow
                    key={task.id}
                    taskName={task.name}
                    productName={task.product}
                    quantity={formatQuantity(isPaid, lawnSqft, task.labelRate)}
                    dueDate={task.due}
                    isComplete={false}
                    isLocked={!isPaid}
                    complianceBadges={task.badges}
                    onToggle={() => {}}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade nudge for non-paid users */}
        {!isPaid && (
          <div className="mt-8">
            <UpgradeNudge
              headline="See Exact Quantities"
              body="Unlock your personalized plan with product quantities calculated for your exact lawn size. One-time $67 payment, lifetime access."
              onUnlockClick={() => setShowModal(true)}
            />
          </div>
        )}

        {/* Sticky bottom bar for non-paid users */}
        {!isPaid && (
          <div className="fixed bottom-0 left-0 right-0 z-30 bg-forest/95 backdrop-blur-sm border-t border-white/10 px-4 py-3">
            <div className="mx-auto max-w-3xl flex items-center justify-between">
              <div>
                <p className="font-display text-lg text-white">
                  Unlock Your Full Plan
                </p>
                <p className="font-mono text-xs text-white/60">
                  One-time $67 · Lifetime access
                </p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="rounded-xl bg-orange px-5 py-2.5 font-display text-sm text-white uppercase tracking-wider hover:bg-orange/90 transition-colors"
              >
                Unlock — $67 →
              </button>
            </div>
          </div>
        )}

        {/* Add bottom padding when sticky bar is showing */}
        {!isPaid && <div className="h-20" />}
      </main>

      <UnlockModal
        lawnSqft={lawnSqft ?? undefined}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onStripeCheckout={handleStripeCheckout}
      />
    </>
  );
}
