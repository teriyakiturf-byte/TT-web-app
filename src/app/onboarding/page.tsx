"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Suspense } from "react";
import Image from "next/image";
import Nav from "@/components/Nav";
import LawnInfoChip from "@/components/ui/LawnInfoChip";
import LawnMeasurementMap from "@/components/LawnMeasurementMap";
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

// Photo-quiz grass choices. "mixed" is a UI-only value: it resolves to
// "tall-fescue" for plan generation (the most common KC grass), since the
// rest of the app/API speaks the canonical GrassType vocabulary.
type GrassChoice = "tall-fescue" | "kentucky-bluegrass" | "zoysia" | "mixed";

const GRASS_QUIZ: {
  value: GrassChoice;
  label: string;
  desc: string;
  subNote?: string;
  image: string;
  placeholderBg: string;
  isPlaceholderQuestion?: boolean;
}[] = [
  {
    value: "tall-fescue",
    label: "Tall Fescue",
    desc: "Broad, dark green blades. Stays green in KC winters.",
    subNote: "Most common in Johnson County",
    image: "/images/grass/tall-fescue.jpg",
    placeholderBg: "#2D6A4F",
  },
  {
    value: "kentucky-bluegrass",
    label: "Kentucky Bluegrass",
    desc: "Fine, boat-shaped blades. Bright green. Goes tan in summer heat.",
    image: "/images/grass/kentucky-bluegrass.jpg",
    placeholderBg: "#1B4332",
  },
  {
    value: "zoysia",
    label: "Zoysia",
    desc: "Dense, carpet-like. Turns tan in fall. Slow to green up in spring.",
    image: "/images/grass/zoysia.jpg",
    placeholderBg: "#74C69D",
  },
  {
    value: "mixed",
    label: "Not Sure",
    desc: "No problem — we will build your plan around the most common KC grass.",
    image: "/images/grass/mixed.jpg",
    placeholderBg: "#95D5B2",
    isPlaceholderQuestion: true,
  },
];

// "mixed" / "Not Sure" maps to tall-fescue for plan generation; the other
// quiz values are already canonical GrassType values.
function resolveGrassType(choice: GrassChoice): GrassType {
  return choice === "mixed" ? "tall-fescue" : choice;
}

// Re-highlight the matching card for returning users from a saved value.
function savedGrassToChoice(saved: string): GrassChoice | null {
  if (
    saved === "tall-fescue" ||
    saved === "kentucky-bluegrass" ||
    saved === "zoysia"
  ) {
    return saved;
  }
  if (saved === "mixed" || saved === "mixed-unsure") return "mixed";
  return null;
}

// Card image: Next.js Image with a colored placeholder box behind it. If the
// photo doesn't exist yet (404), onError reveals the colored box.
function GrassCardImage({
  src,
  alt,
  bg,
  showQuestion,
}: {
  src: string;
  alt: string;
  bg: string;
  showQuestion?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className="relative aspect-square w-full"
      style={{ backgroundColor: bg }}
    >
      {!failed ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 45vw, 220px"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        showQuestion && (
          <span className="absolute inset-0 flex items-center justify-center text-white/80 text-3xl font-bold">
            ?
          </span>
        )
      )}
    </div>
  );
}

type LawnSize = "small" | "medium" | "large" | "xl";

const SIZE_OPTIONS: {
  value: LawnSize;
  label: string;
  range: string;
  hint: string;
  sqft: number;
}[] = [
  { value: "small",  label: "Small",  range: "Under 3,000 sq ft",   hint: "(about the size of a 2-car garage x3)", sqft: 2000 },
  { value: "medium", label: "Medium", range: "3,000–7,000 sq ft",   hint: "(most Johnson County lots)",           sqft: 5000 },
  { value: "large",  label: "Large",  range: "7,000–12,000 sq ft",  hint: "(corner lots, newer builds)",          sqft: 9500 },
  { value: "xl",     label: "XL",     range: "Over 12,000 sq ft",   hint: "(acreage, rural, large suburban)",     sqft: 15000 },
];

// Map a measured/saved sqft value back to the closest radio bucket so returning
// users (and map measurements) keep a selection highlighted.
function sqftToSize(n: number): LawnSize {
  if (n < 3000) return "small";
  if (n <= 7000) return "medium";
  if (n <= 12000) return "large";
  return "xl";
}

function OnboardingWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();

  const initialStep = Number(searchParams.get("step")) || 1;
  const clampedStep = Math.min(Math.max(initialStep, 1), 3);
  const zipFromUrl = searchParams.get("zip") ?? "";

  const [currentStep, setCurrentStep] = useState(clampedStep);
  const [zip, setZip] = useState(zipFromUrl);
  const [grassChoice, setGrassChoice] = useState<GrassChoice | null>(null);
  const [lawnSqft, setLawnSqft] = useState("");
  const [selectedSize, setSelectedSize] = useState<LawnSize | null>(null);
  const [mapExpanded, setMapExpanded] = useState(false);

  useEffect(() => {
    if (!zipFromUrl) {
      const savedZip = localStorage.getItem("tt_zip");
      if (savedZip) setZip(savedZip);
    }

    const savedGrass = localStorage.getItem("tt_grass");
    if (savedGrass) {
      const choice = savedGrassToChoice(savedGrass);
      if (choice) setGrassChoice(choice);
    }

    const savedSqft = localStorage.getItem("tt_sqft");
    if (savedSqft && Number(savedSqft) > 0) {
      setLawnSqft(savedSqft);
      setSelectedSize(sqftToSize(Number(savedSqft)));
    }
  }, [zipFromUrl]);

  function handleSelectSize(opt: (typeof SIZE_OPTIONS)[number]) {
    setSelectedSize(opt.value);
    // Radio selection sets the midpoint sqft; an active map measurement may
    // later override this value via onMeasurementComplete.
    setLawnSqft(String(opt.sqft));
  }

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
    if (currentStep === 2 && grassChoice) {
      localStorage.setItem("tt_grass", resolveGrassType(grassChoice));
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

  // Resolve the grass value to persist: the selected card, falling back to a
  // previously saved value (e.g. for users who deep-link straight to step 3).
  function persistedGrassType(): GrassType {
    if (grassChoice) return resolveGrassType(grassChoice);
    const saved = localStorage.getItem("tt_grass");
    return (saved && savedGrassToChoice(saved)
      ? resolveGrassType(savedGrassToChoice(saved)!)
      : "tall-fescue");
  }

  async function handleFinish() {
    if (zip) localStorage.setItem("tt_zip", zip);
    const grassType = persistedGrassType();
    localStorage.setItem("tt_grass", grassType);
    if (sqftValid) {
      localStorage.setItem("tt_sqft", lawnSqft);
    }
    await saveProfileToDB({ zip, grassType, lawnSqft: sqftValid ? lawnSqft : undefined });
    router.push("/plan");
  }

  async function handleSkipSize() {
    if (zip) localStorage.setItem("tt_zip", zip);
    const grassType = persistedGrassType();
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

        {/* Step 2: Grass Type Photo Quiz — 2x2 grid of tappable image cards */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="font-display text-hero text-forest">
                Which looks most like your lawn right now?
              </h1>
              <p className="text-sm text-muted mt-1">
                Don&apos;t stress it — most KC lawns are one of these four.
              </p>
            </div>

            <div>
              <div
                role="radiogroup"
                aria-label="Grass type"
                className="grid grid-cols-2 gap-3 md:gap-4"
              >
                {GRASS_QUIZ.map((opt) => {
                  const isSelected = grassChoice === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setGrassChoice(opt.value)}
                      className={`relative rounded-xl overflow-hidden text-left cursor-pointer transition-all ${
                        isSelected
                          ? "border-2 border-[#F4631E] ring-2 ring-[#F4631E] ring-offset-1"
                          : "border-2 border-gray-200"
                      }`}
                    >
                      <GrassCardImage
                        src={opt.image}
                        alt={opt.label}
                        bg={opt.placeholderBg}
                        showQuestion={opt.isPlaceholderQuestion}
                      />

                      {isSelected && (
                        <span className="absolute top-2 right-2 rounded-full bg-[#F4631E] text-white w-5 h-5 flex items-center justify-center text-xs font-bold">
                          ✓
                        </span>
                      )}

                      <p className="font-bold text-sm text-[#1B4332] px-3 pt-2">
                        {opt.label}
                      </p>
                      <p
                        className={`text-xs text-gray-500 px-3 ${
                          opt.subNote ? "" : "pb-2"
                        }`}
                      >
                        {opt.desc}
                      </p>
                      {opt.subNote && (
                        <p className="text-[11px] font-semibold text-[#2D6A4F] px-3 pt-1 pb-2">
                          {opt.subNote}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-gray-400 text-center mt-3">
                You can update this in Settings after you see your plan.
              </p>
            </div>

            <div>
              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="rounded-xl border-2 border-border px-4 py-3 font-display text-sm text-muted uppercase tracking-wider hover:bg-cream transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!grassChoice}
                  className={`flex-1 rounded-xl px-6 py-3 font-display text-lg text-white uppercase tracking-wider transition-colors ${
                    grassChoice
                      ? "bg-lime hover:bg-lime/90 cursor-pointer"
                      : "bg-lime/40 cursor-not-allowed"
                  }`}
                >
                  Next →
                </button>
              </div>
              {!grassChoice && (
                <p className="text-xs text-muted text-center mt-2">
                  Tap the photo that looks most like your lawn to continue
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Lawn Size — radio buttons + optional map */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="font-display text-hero text-forest">
                How big is your lawn?
              </h1>
              <p className="text-sm text-muted mt-1">
                Grass area only — not your full lot.
              </p>
            </div>

            {/* Radio button cards — full width on mobile, 2-col on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SIZE_OPTIONS.map((opt) => {
                const isSelected = selectedSize === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleSelectSize(opt)}
                    className={`w-full text-left rounded-xl p-4 cursor-pointer transition-colors ${
                      isSelected
                        ? "border-2 border-[#F4631E] bg-[#FFF3EC]"
                        : "border-2 border-gray-200 bg-white hover:bg-cream"
                    }`}
                  >
                    <p className="font-bold text-base text-[#1B4332]">
                      {opt.label}
                    </p>
                    <p className="text-sm text-gray-600">{opt.range}</p>
                    <p className="text-xs text-gray-400 italic mt-0.5">
                      {opt.hint}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Optional map expansion */}
            <div>
              <button
                type="button"
                onClick={() => setMapExpanded((v) => !v)}
                className="text-sm text-[#52B788] underline cursor-pointer"
              >
                {mapExpanded
                  ? "Hide map ↑"
                  : "Want exact product quantities? Measure my lawn on the map ↓"}
              </button>

              {mapExpanded && (
                <div className="mt-3">
                  <LawnMeasurementMap
                    onMeasurementComplete={(val) => {
                      // A completed measurement overrides the radio midpoint and
                      // keeps the matching size bucket highlighted.
                      setLawnSqft(String(val));
                      setSelectedSize(sqftToSize(val));
                    }}
                    initialSqft={lawnSqft ? Number(lawnSqft) : undefined}
                  />
                </div>
              )}
            </div>

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
                  disabled={!selectedSize}
                  className={`flex-1 rounded-xl px-6 py-3 font-display text-lg text-white uppercase tracking-wider transition-colors ${
                    selectedSize
                      ? "bg-orange hover:bg-orange/90 cursor-pointer"
                      : "bg-orange/40 cursor-not-allowed"
                  }`}
                >
                  Finish Setup →
                </button>
              </div>
              {!selectedSize && (
                <p className="text-xs text-muted text-center mt-2">
                  Select your lawn size to continue
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
