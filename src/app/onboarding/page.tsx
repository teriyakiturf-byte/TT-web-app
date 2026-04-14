"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Suspense } from "react";
import Nav from "@/components/Nav";
import LawnInfoChip from "@/components/ui/LawnInfoChip";
import EmptyStateCard from "@/components/ui/EmptyStateCard";
import type { GrassType } from "@/types";

const KC_ZIPS = [
  "64101","64102","64105","64106","64108","64109","64110","64111","64112",
  "64113","64114","64116","64117","64118","64119","64120","64123","64124",
  "64125","64126","64127","64128","64129","64130","64131","64132","64133",
  "64134","64136","64137","64138","64139","64145","64146","64147","64149",
  "64150","64151","64152","64153","64154","64155","64156","64157","64158",
  "64161","64162","64163","64164","64165","64166","64167","66061","66062",
  "66202","66203","66204","66205","66206","66207","66208","66209","66210",
  "66211","66212","66213","66214","66215","66216","66217","66218","66219",
  "66220","66221","66223","66224","66226","66227",
];

const GRASS_OPTIONS: {
  value: GrassType;
  label: string;
  desc: string;
  fullWidth?: boolean;
}[] = [
  { value: "tall-fescue", label: "Tall Fescue", desc: "Most KC lawns" },
  { value: "kentucky-bluegrass", label: "Kentucky Bluegrass", desc: "Full sun areas" },
  { value: "zoysia", label: "Zoysia", desc: "Warm season patches" },
  { value: "buffalo-grass", label: "Buffalo Grass", desc: "Low maintenance" },
  { value: "mixed-unsure", label: "Mixed / Not Sure", desc: "We'll use Tall Fescue as your base", fullWidth: true },
];

function OnboardingWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();

  const initialStep = Number(searchParams.get("step")) || 1;
  const clampedStep = Math.min(Math.max(initialStep, 1), 3);

  const [currentStep, setCurrentStep] = useState(clampedStep);
  const [zip, setZip] = useState("");
  const [grassType, setGrassType] = useState<GrassType>("tall-fescue");
  const [lawnSqft, setLawnSqft] = useState("");
  const [sizeMethod, setSizeMethod] = useState<"draw" | "manual" | null>(null);

  useEffect(() => {
    const savedZip = localStorage.getItem("tt_zip");
    if (savedZip) setZip(savedZip);

    const savedGrass = localStorage.getItem("tt_grass") as GrassType | null;
    if (savedGrass) setGrassType(savedGrass);

    const savedSqft = localStorage.getItem("tt_sqft");
    if (savedSqft && Number(savedSqft) > 0) {
      setLawnSqft(savedSqft);
      setSizeMethod("manual");
    }
  }, []);

  const isKC = zip.length === 5 && KC_ZIPS.includes(zip);
  const zipValid = zip.length === 5;
  const sqftNum = Number(lawnSqft);
  const sqftValid = sqftNum > 0;

  // Savings calculation for step 3
  const annualSavings = sqftValid ? Math.round((sqftNum / 5000) * 373) : 0;
  const fiveYearSavings = annualSavings * 5;

  function handleNext() {
    if (currentStep === 1 && zip) {
      localStorage.setItem("tt_zip", zip);
    }
    if (currentStep === 2) {
      localStorage.setItem("tt_grass", grassType);
    }
    setCurrentStep((s) => Math.min(s + 1, 3));
  }

  function handleBack() {
    setCurrentStep((s) => Math.max(s - 1, 1));
  }

  async function saveProfileToDB(fields: { zip?: string; grassType?: string; lawnSqft?: string }) {
    if (status !== "authenticated") return;
    try {
      await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
    } catch {
      // DB save failed — localStorage still has the data as fallback
    }
  }

  async function handleFinish() {
    if (zip) localStorage.setItem("tt_zip", zip);
    localStorage.setItem("tt_grass", grassType);
    if (sqftValid) {
      localStorage.setItem("tt_sqft", lawnSqft);
    }
    await saveProfileToDB({ zip, grassType, lawnSqft: sqftValid ? lawnSqft : undefined });
    router.push("/plan");
  }

  async function handleSkipSize() {
    if (zip) localStorage.setItem("tt_zip", zip);
    localStorage.setItem("tt_grass", grassType);
    await saveProfileToDB({ zip, grassType });
    router.push("/plan");
  }

  return (
    <>
      <Nav userState="free" />

      <main className="mx-auto max-w-md px-4 py-8">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full font-mono text-sm transition-colors ${
                  s < currentStep
                    ? "bg-lime text-white"
                    : s === currentStep
                    ? "bg-forest text-white"
                    : "bg-border text-muted"
                }`}
              >
                {s < currentStep ? "✓" : s}
              </div>
              {s < 3 && (
                <div
                  className={`h-0.5 w-8 transition-colors ${
                    s < currentStep ? "bg-lime" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: ZIP + Zone Confirmation */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="font-display text-hero text-forest">
                Confirm Your Zone
              </h1>
              <p className="text-sm text-muted mt-1">
                We use your ZIP to personalize timing and products.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-white p-5">
              <label className="font-mono text-xs text-muted uppercase tracking-wide block mb-2">
                Your ZIP Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={zip}
                onChange={(e) =>
                  setZip(e.target.value.replace(/\D/g, "").slice(0, 5))
                }
                placeholder="e.g. 66062"
                className="w-full rounded-lg border-2 border-border bg-cream px-4 py-2 font-mono text-lg text-center focus:border-lime focus:outline-none transition-colors"
              />
              {zipValid && (
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  <LawnInfoChip type="zone" value={isKC ? "Zone 6a — KC Metro" : "Zone 6a"} />
                  {isKC && <LawnInfoChip type="soil" value="KC Heavy Clay Soil" />}
                </div>
              )}
            </div>

            {zipValid && !isKC && (
              <p className="text-sm text-orange text-center">
                This ZIP isn&apos;t in the KC metro area. Your plan will still work for Zone 6a, but some KC-specific tips won&apos;t apply.
              </p>
            )}

            <div>
              <button
                onClick={handleNext}
                disabled={!zipValid}
                className={`w-full rounded-xl px-6 py-3 font-display text-lg text-white uppercase tracking-wider transition-colors ${
                  zipValid
                    ? "bg-lime hover:bg-lime/90 cursor-pointer"
                    : "bg-lime/40 cursor-not-allowed"
                }`}
              >
                {isKC ? "Yes, That's Me — Next →" : "Next →"}
              </button>
              {!zipValid && (
                <p className="text-xs text-muted text-center mt-2">
                  Enter your ZIP code above to continue
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Grass Type Selection — 2x2 grid */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="font-display text-hero text-forest">
                What Grass Do You Have?
              </h1>
              <p className="text-sm text-muted mt-1">
                This determines seed rates, mow heights, and seasonal timing.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {GRASS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setGrassType(opt.value)}
                  className={`rounded-xl border-2 px-4 py-3 text-left transition-colors ${
                    opt.fullWidth ? "col-span-2" : ""
                  } ${
                    grassType === opt.value
                      ? "border-lime bg-lime-light"
                      : "border-border bg-white hover:bg-cream"
                  }`}
                >
                  <p className="text-sm font-medium text-charcoal">
                    {opt.label}
                  </p>
                  <p className="text-xs text-muted mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="rounded-xl border-2 border-border px-4 py-3 font-display text-sm text-muted uppercase tracking-wider hover:bg-cream transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleNext}
                className="flex-1 rounded-xl bg-lime px-6 py-3 font-display text-lg text-white uppercase tracking-wider hover:bg-lime/90 transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Lawn Size — inline measurement */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="font-display text-hero text-forest">
                How Big Is Your Lawn?
              </h1>
              <p className="text-sm text-muted mt-1">
                We calculate exact product quantities from your lawn size.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSizeMethod("draw")}
                className={`rounded-xl border-2 p-4 text-center transition-colors ${
                  sizeMethod === "draw"
                    ? "border-lime bg-lime-light"
                    : "border-border bg-white hover:bg-cream"
                }`}
              >
                <p className="font-display text-lg text-forest">Draw It</p>
                <p className="text-xs text-muted mt-1">Use Google Maps</p>
              </button>
              <button
                onClick={() => setSizeMethod("manual")}
                className={`rounded-xl border-2 p-4 text-center transition-colors ${
                  sizeMethod === "manual"
                    ? "border-lime bg-lime-light"
                    : "border-border bg-white hover:bg-cream"
                }`}
              >
                <p className="font-display text-lg text-forest">
                  I&apos;ll Type It
                </p>
                <p className="text-xs text-muted mt-1">Manual input</p>
              </button>
            </div>

            {/* Draw It — inline map (or fallback) */}
            {sizeMethod === "draw" && (
              <div className="rounded-2xl overflow-hidden border border-border bg-white">
                <div className="aspect-[4/3] flex items-center justify-center p-6">
                  <EmptyStateCard
                    variant="measurement"
                    headline="Map Loading Soon"
                    body="Google Maps integration is being configured. Use manual entry for now."
                    ctaLabel="Enter Size Manually"
                    onCtaClick={() => setSizeMethod("manual")}
                  />
                </div>
              </div>
            )}

            {/* Manual input */}
            {sizeMethod === "manual" && (
              <div className="rounded-xl border border-border bg-white p-4">
                <label className="font-mono text-xs text-muted uppercase tracking-wide block mb-1">
                  Lawn Size (sq ft)
                </label>
                <input
                  type="number"
                  value={lawnSqft}
                  onChange={(e) => setLawnSqft(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full rounded-lg border-2 border-border bg-cream px-4 py-2 font-mono text-lg text-center focus:border-lime focus:outline-none transition-colors"
                />
              </div>
            )}

            {/* Savings preview — shows when sqft is valid */}
            {sqftValid && (
              <div className="rounded-xl bg-forest p-4 text-white text-center">
                <p className="text-sm text-white/70">
                  With a {sqftNum.toLocaleString()} sq ft lawn:
                </p>
                <p className="mt-1">
                  <span className="font-display text-[28px] text-lime">
                    ~${annualSavings}
                  </span>
                  <span className="text-sm text-white/70">/yr saved vs. TruGreen</span>
                </p>
                <p className="text-xs text-white/50 mt-1">
                  ~${fiveYearSavings.toLocaleString()} over 5 years
                </p>
              </div>
            )}

            <div>
              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="rounded-xl border-2 border-border px-4 py-3 font-display text-sm text-muted uppercase tracking-wider hover:bg-cream transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handleFinish}
                  disabled={!sqftValid}
                  className={`flex-1 rounded-xl px-6 py-3 font-display text-lg text-white uppercase tracking-wider transition-colors ${
                    sqftValid
                      ? "bg-orange hover:bg-orange/90 cursor-pointer"
                      : "bg-orange/40 cursor-not-allowed"
                  }`}
                >
                  Finish Setup →
                </button>
              </div>
              {!sqftValid && (
                <p className="text-xs text-muted text-center mt-2">
                  Select a method and enter your lawn size to continue
                </p>
              )}
            </div>

            <button
              onClick={handleSkipSize}
              className="w-full text-center text-xs text-muted hover:text-charcoal transition-colors"
            >
              Skip for now — I&apos;ll add it later
            </button>
          </div>
        )}
      </main>
    </>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense>
      <OnboardingWizard />
    </Suspense>
  );
}
