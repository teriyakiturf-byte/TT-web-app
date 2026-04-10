"use client";

import { useState, useEffect } from "react";
import Nav from "@/components/Nav";
import SoftGateOverlay from "@/components/ui/SoftGateOverlay";
import UnlockModal from "@/components/ui/UnlockModal";
import HeroTaskCard from "@/components/ui/HeroTaskCard";
import TaskRow from "@/components/ui/TaskRow";
import StatCard from "@/components/ui/StatCard";
import SeasonPill from "@/components/ui/SeasonPill";
import UpgradeNudge from "@/components/ui/UpgradeNudge";

const SAMPLE_TASKS = [
  {
    id: "1",
    name: "Apply Pre-Emergent (Split App #1)",
    product: "Prodiamine 65 WDG",
    quantity: "4.3 lbs",
    due: "Mar 15 – Apr 1",
    badges: ["blackout-compliant" as const, "joco-law" as const],
  },
  {
    id: "2",
    name: "First Mow — Set Height to 3.5″",
    product: "Mower blade sharpened",
    quantity: "—",
    due: "When grass hits 4″",
    badges: [],
  },
  {
    id: "3",
    name: "Broadleaf Weed Spray",
    product: "Trimec Classic",
    quantity: "2.1 oz",
    due: "Apr 15 – May 1",
    badges: ["no-phosphorus" as const],
  },
  {
    id: "4",
    name: "Spring Fertilizer Application",
    product: "Milorganite 6-4-0",
    quantity: "16 lbs",
    due: "May 1 – May 15",
    badges: ["blackout-compliant" as const],
  },
  {
    id: "5",
    name: "Grub Preventative",
    product: "GrubEx (Chlorantraniliprole)",
    quantity: "5.5 lbs",
    due: "May 15 – Jun 1",
    badges: [],
  },
];

export default function PlanPage() {
  const [showModal, setShowModal] = useState(false);
  const [lawnSqft, setLawnSqft] = useState<number | undefined>(undefined);
  const [userState, setUserState] = useState<"guest" | "free" | "paid">("free");

  useEffect(() => {
    const sqft = localStorage.getItem("tt_sqft");
    if (sqft) setLawnSqft(Number(sqft));
    const state = localStorage.getItem("tt_user_state");
    if (state === "paid") setUserState("paid");
    else if (state === "free") setUserState("free");
  }, []);

  const isPaid = userState === "paid";

  function handleStripeCheckout() {
    // TODO: Wire up Stripe checkout
    // Stub: simulate payment success
    localStorage.setItem("tt_user_state", "paid");
    setUserState("paid");
    setShowModal(false);
    window.location.href = "/thank-you";
  }

  return (
    <>
      <Nav userState={userState} />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="font-display text-hero text-forest text-center">
          Your KC Lawn Plan
        </h1>
        <p className="text-sm text-muted text-center mt-2">
          {lawnSqft
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

        {/* Blurred content section for free users */}
        <div className="relative mt-8">
          {!isPaid && (
            <SoftGateOverlay
              onUnlockClick={() => setShowModal(true)}
              lawnSqft={lawnSqft}
            />
          )}

          <div className={!isPaid ? "soft-gate-content" : ""}>
            {/* Hero Task Card */}
            <HeroTaskCard
              taskName="Apply Pre-Emergent (Split App #1)"
              productName="Prodiamine 65 WDG"
              calculatedQuantity={lawnSqft ? `${((lawnSqft / 1000) * 0.86).toFixed(1)} lbs` : "4.3 lbs"}
              applicationNotes="Apply when soil temps reach 50–55°F consistently. Water in within 24 hours."
              tier={1}
              isBlurred={false}
              onMarkComplete={() => {}}
              onSnooze={() => {}}
              onSkip={() => {}}
              snoozeCount={0}
              whyContext="Soil temps in KC are crossing 55°F — your crabgrass pre-emergent window is closing. Prodiamine creates a chemical barrier that prevents crabgrass seeds from germinating."
            />

            {/* Stats Row */}
            <div className="flex gap-3 mt-6 overflow-x-auto pb-2">
              <StatCard label="Tasks Done" value="2 / 14" subtitle="Spring: 1 of 5" />
              <StatCard label="Saved vs. Pro" value="$373" subtitle="per year" />
              <StatCard label="Next Task" value="Apr 15" subtitle="Broadleaf spray" />
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
                    quantity={task.quantity}
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

        {/* Upgrade nudge for free users */}
        {!isPaid && (
          <div className="mt-8">
            <UpgradeNudge
              headline="See Exact Quantities"
              body="Unlock your personalized plan with product quantities calculated for your exact lawn size. One-time $67 payment, lifetime access."
              onUnlockClick={() => setShowModal(true)}
            />
          </div>
        )}

        {/* Sticky bottom bar for free users */}
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
        lawnSqft={lawnSqft}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onStripeCheckout={handleStripeCheckout}
      />
    </>
  );
}
