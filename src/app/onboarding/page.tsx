"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/components/Nav";
import LawnInfoChip from "@/components/ui/LawnInfoChip";
import type { GrassType } from "@/types";

const GRASS_OPTIONS: { value: GrassType; label: string; note?: string }[] = [
  { value: "tall-fescue", label: "Tall Fescue", note: "Most KC lawns are Tall Fescue" },
  { value: "kentucky-bluegrass", label: "Kentucky Bluegrass" },
  { value: "zoysia", label: "Zoysia" },
  { value: "buffalo-grass", label: "Buffalo Grass" },
  { value: "mixed-unsure", label: "Mixed / Unsure" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [zip, setZip] = useState("66062");
  const [grassType, setGrassType] = useState<GrassType>("tall-fescue");
  const [lawnSqft, setLawnSqft] = useState("");
  const [sizeMethod, setSizeMethod] = useState<"draw" | "manual" | null>(null);

  function handleFinish() {
    // TODO: Save to user profile / context
    localStorage.setItem("tt_zip", zip);
    localStorage.setItem("tt_grass", grassType);
    localStorage.setItem("tt_sqft", lawnSqft);
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
                className={`flex h-8 w-8 items-center justify-center rounded-full font-mono text-sm ${
                  s <= step
                    ? "bg-lime text-white"
                    : "bg-border text-muted"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`h-0.5 w-8 ${
                    s < step ? "bg-lime" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: ZIP Confirm */}
        {step === 1 && (
          <div className="space-y-6">
            <h1 className="font-display text-hero text-forest text-center">
              Confirm Your Zone
            </h1>

            <div className="rounded-xl border border-border bg-white p-5">
              <p className="font-mono text-xs text-muted uppercase tracking-wide mb-2">
                Your ZIP Code
              </p>
              <input
                type="text"
                value={zip}
                onChange={(e) =>
                  setZip(e.target.value.replace(/\D/g, "").slice(0, 5))
                }
                className="w-full rounded-lg border-2 border-border bg-cream px-4 py-2 font-mono text-lg text-center focus:border-lime focus:outline-none"
              />
              <div className="flex justify-center mt-3">
                <LawnInfoChip type="zone" value="Zone 6a — KC Metro" />
              </div>
            </div>

            <p className="text-sm text-muted text-center">
              Is this your lawn&apos;s ZIP?
            </p>

            <button
              onClick={() => setStep(2)}
              className="w-full rounded-xl bg-lime px-6 py-3 font-display text-lg text-white uppercase tracking-wider hover:bg-lime/90 transition-colors"
            >
              Yes — Next →
            </button>
          </div>
        )}

        {/* Step 2: Grass Type */}
        {step === 2 && (
          <div className="space-y-6">
            <h1 className="font-display text-hero text-forest text-center">
              What Grass Are You Working With?
            </h1>

            <div className="space-y-2">
              {GRASS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setGrassType(opt.value)}
                  className={`w-full rounded-xl border-2 px-4 py-3 text-left transition-colors ${
                    grassType === opt.value
                      ? "border-lime bg-lime-light"
                      : "border-border bg-white hover:bg-cream"
                  }`}
                >
                  <p className="text-sm font-medium text-charcoal">
                    {opt.label}
                  </p>
                  {opt.note && grassType === opt.value && (
                    <p className="text-xs text-muted mt-0.5">{opt.note}</p>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(3)}
              className="w-full rounded-xl bg-lime px-6 py-3 font-display text-lg text-white uppercase tracking-wider hover:bg-lime/90 transition-colors"
            >
              Next →
            </button>
          </div>
        )}

        {/* Step 3: Lawn Size */}
        {step === 3 && (
          <div className="space-y-6">
            <h1 className="font-display text-hero text-forest text-center">
              How Big Is Your Lawn?
            </h1>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setSizeMethod("draw");
                  router.push("/measure");
                }}
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
                  I&apos;ll Enter It
                </p>
                <p className="text-xs text-muted mt-1">Manual input</p>
              </button>
            </div>

            {sizeMethod === "manual" && (
              <div className="rounded-xl border border-border bg-white p-4">
                <label className="font-mono text-xs text-muted uppercase tracking-wide">
                  Lawn Size (sq ft)
                </label>
                <input
                  type="number"
                  value={lawnSqft}
                  onChange={(e) => setLawnSqft(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full mt-1 rounded-lg border-2 border-border bg-cream px-4 py-2 font-mono text-lg text-center focus:border-lime focus:outline-none"
                />
              </div>
            )}

            <button
              onClick={handleFinish}
              disabled={!lawnSqft && sizeMethod !== "draw"}
              className="w-full rounded-xl bg-orange px-6 py-3 font-display text-lg text-white uppercase tracking-wider hover:bg-orange/90 transition-colors disabled:opacity-50"
            >
              Finish Setup →
            </button>
          </div>
        )}
      </main>
    </>
  );
}
