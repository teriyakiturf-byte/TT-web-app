"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/components/Nav";
import EmptyStateCard from "@/components/ui/EmptyStateCard";
import CreateAccountModal from "@/components/CreateAccountModal";
import { useUserState } from "@/hooks/useUserState";
import { calculateSavings } from "@/types";

export default function MeasurePage() {
  const router = useRouter();
  const { isGuest, markFree } = useUserState();
  const [sqft, setSqft] = useState("");
  const [measured, setMeasured] = useState(false);
  const [mapError] = useState(true); // TODO: Set to false when Google Maps API is configured
  const [showModal, setShowModal] = useState(false);
  const savings = sqft ? calculateSavings(Number(sqft)) : null;

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sqft) setMeasured(true);
  }

  function handleSaveCta() {
    // Save sqft to localStorage regardless
    if (sqft) localStorage.setItem("tt_sqft", sqft);

    if (isGuest) {
      setShowModal(true);
    } else {
      // Already has account — go to onboarding or plan
      router.push("/onboarding");
    }
  }

  function handleAccountCreated(email: string) {
    markFree(email);
    if (sqft) localStorage.setItem("tt_sqft", sqft);
    setShowModal(false);
    router.push("/onboarding");
  }

  return (
    <>
      <Nav userState="guest" />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="font-display text-hero text-forest text-center">
          Measure Your Lawn
        </h1>
        <p className="text-sm text-muted text-center mt-2">
          Tap to draw your lawn boundary. Click first point to close.
        </p>

        {/* Map area */}
        <div className="mt-6 aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-white">
          {mapError ? (
            <div className="h-full flex items-center justify-center p-6">
              <EmptyStateCard
                variant="measurement"
                headline="Map Loading Soon"
                body="Google Maps integration is being configured. Enter your lawn size manually below."
                ctaLabel="Enter Size Manually"
                onCtaClick={() => document.getElementById("manual-input")?.focus()}
              />
            </div>
          ) : (
            <div className="h-full bg-gray-200 flex items-center justify-center text-muted">
              {/* TODO: Google Maps canvas */}
              Google Maps will render here
            </div>
          )}
        </div>

        {/* Manual input fallback */}
        <form
          onSubmit={handleManualSubmit}
          className="mt-6 rounded-xl border border-border bg-white p-5"
        >
          <label className="font-mono text-xs text-muted uppercase tracking-wide">
            Enter Lawn Size (sq ft)
          </label>
          <div className="flex gap-3 mt-2">
            <input
              id="manual-input"
              type="number"
              value={sqft}
              onChange={(e) => {
                setSqft(e.target.value);
                setMeasured(false);
              }}
              placeholder="e.g. 5000"
              className="flex-1 rounded-lg border-2 border-border bg-cream px-4 py-2 font-mono text-lg focus:border-lime focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-lime px-5 py-2 font-display text-white uppercase tracking-wider hover:bg-lime/90 transition-colors"
            >
              Calculate
            </button>
          </div>
        </form>

        {/* Result display */}
        {measured && sqft && (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl bg-forest p-6 text-center text-white">
              <p className="font-display text-5xl">{Number(sqft).toLocaleString()}</p>
              <p className="font-mono text-sm text-lime mt-1">square feet</p>
            </div>

            {/* Savings card */}
            {savings && (
              <div className="rounded-xl border border-border bg-white p-5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">
                  Your Estimated Savings
                </p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="font-display text-2xl text-muted">
                      ~${savings.annualProCost}
                    </p>
                    <p className="font-mono text-[10px] text-muted">
                      TruGreen/yr
                    </p>
                  </div>
                  <div>
                    <p className="font-display text-2xl text-lime">
                      ~${savings.annualDiyCost}
                    </p>
                    <p className="font-mono text-[10px] text-muted">
                      DIY w/ plan/yr
                    </p>
                  </div>
                  <div>
                    <p className="font-display text-2xl text-forest">
                      ~${savings.annualSavings}
                    </p>
                    <p className="font-mono text-[10px] text-forest font-medium">
                      You save/yr
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleSaveCta}
              className="block w-full text-center rounded-xl bg-orange px-6 py-3 font-display text-lg text-white uppercase tracking-wider hover:bg-orange/90 transition-colors"
            >
              Save This Measurement — Create Free Account →
            </button>
          </div>
        )}
      </main>

      <CreateAccountModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleAccountCreated}
        entryPoint="measurement"
        prefillData={{ lawnSqft: sqft ? Number(sqft) : undefined }}
      />
    </>
  );
}
