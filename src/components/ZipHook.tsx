"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Thermometer, AlertTriangle, ArrowRight } from "lucide-react";
import LawnInfoChip from "@/components/ui/LawnInfoChip";
import CreateAccountModal from "@/components/CreateAccountModal";
import { useUserState } from "@/hooks/useUserState";

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

function isKCZip(zip: string) {
  return KC_ZIPS.includes(zip);
}

interface SeasonalAction {
  label: string;
  headline: string;
  body: string;
}

function getSeasonalAction(month: number): SeasonalAction {
  switch (month) {
    case 0:
    case 1:
      return {
        label: "Winter Advisory",
        headline: "Plan Your Spring Pre-Emergent Now",
        body: "Soil temps will cross 50°F in March. Order Prodiamine now so you're ready when forsythia blooms.",
      };
    case 2:
      return {
        label: "March Action",
        headline: "Pre-Emergent Window Opening — Get Ready",
        body: "Soil temps approaching 50°F in KC. Your crabgrass barrier needs to go down before germination starts.",
      };
    case 3:
      return {
        label: "April Action",
        headline: "Pre-Emergent Window Closing — Act Now",
        body: "Soil temps are crossing 55°F in KC. Your crabgrass pre-emergent window is closing fast.",
      };
    case 4:
      return {
        label: "May Alert",
        headline: "Spring Fertilizer Window — Apply Now",
        body: "Soil temps are warm enough for Milorganite. Apply your spring feeding before summer heat arrives.",
      };
    case 5:
      return {
        label: "June Action",
        headline: "Raise Mow Height — Summer Stress Incoming",
        body: "KC heat is here. Raise your mow height to 4″ to shade soil and reduce water loss.",
      };
    case 6:
      return {
        label: "July Advisory",
        headline: "Watch for Brown Patch — Fungal Conditions Active",
        body: "Hot, humid KC nights create perfect fungal conditions. Water mornings only, never at night.",
      };
    case 7:
      return {
        label: "August Prep",
        headline: "Fall Overseeding Window Opens Next Month",
        body: "Reserve a core aerator now. September is the #1 month to renovate your KC lawn.",
      };
    case 8:
      return {
        label: "September — The Main Event",
        headline: "Aerate & Overseed Now — Best Window of the Year",
        body: "Soil temps are perfect for tall fescue germination. Aerate, overseed, keep moist for 2-3 weeks.",
      };
    case 9:
      return {
        label: "October Action",
        headline: "Apply Winterizer Fertilizer Before First Frost",
        body: "Final feeding builds root reserves for winter dormancy. Apply Milorganite before ground freezes.",
      };
    case 10:
      return {
        label: "November Prep",
        headline: "Final Mow & Leaf Cleanup",
        body: "Lower mow height to 2.5″ for last cut. Mulch or remove leaves to prevent snow mold.",
      };
    case 11:
      return {
        label: "Winter Advisory",
        headline: "Protect Dormant Turf — Stay Off Frozen Grass",
        body: "Frozen grass blades snap under foot traffic. Plan your spring pre-emergent order now.",
      };
    default:
      return {
        label: "Seasonal Tip",
        headline: "Check Your Zone 6a Schedule",
        body: "Stay on top of your KC lawn care with tasks timed to local soil temps.",
      };
  }
}

function getSoilTempEstimate(month: number): string {
  const estimates: Record<number, string> = {
    0: "~32°F", 1: "~35°F", 2: "~42°F", 3: "~48°F",
    4: "~58°F", 5: "~68°F", 6: "~76°F", 7: "~78°F",
    8: "~72°F", 9: "~60°F", 10: "~48°F", 11: "~38°F",
  };
  return estimates[month] ?? "~50°F";
}

export default function ZipHook() {
  const router = useRouter();
  const { isGuest, markFree } = useUserState();
  const [zip, setZip] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isKC, setIsKC] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const month = new Date().getMonth();
  const seasonal = getSeasonalAction(month);
  const soilTemp = getSoilTempEstimate(month);

  function handleZipChange(value: string) {
    const cleaned = value.replace(/\D/g, "").slice(0, 5);
    setZip(cleaned);
    if (cleaned.length === 5) {
      setSubmitted(true);
      setIsKC(isKCZip(cleaned));
    } else {
      setSubmitted(false);
    }
  }

  function handleCtaClick() {
    if (isGuest) {
      setShowModal(true);
    } else {
      // Already has an account — go to plan
      router.push("/plan");
    }
  }

  function handleAccountCreated(email: string) {
    markFree(email);
    if (zip) localStorage.setItem("tt_zip", zip);
    setShowModal(false);
    router.push("/onboarding");
  }

  return (
    <div>
      <div className="mx-auto max-w-xs">
        <input
          type="text"
          inputMode="numeric"
          value={zip}
          onChange={(e) => handleZipChange(e.target.value)}
          placeholder="Enter ZIP code"
          className="w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-center font-mono text-lg text-charcoal placeholder:text-muted/50 focus:border-lime focus:outline-none transition-colors"
        />
      </div>

      {submitted && (
        <div className="mt-6 space-y-4 animate-in fade-in duration-300">
          {/* Zone & info chips */}
          <div className="flex flex-wrap justify-center gap-2">
            <LawnInfoChip type="zone" value={isKC ? "Zone 6a — KC Metro" : "Zone 6a"} />
            {isKC && <LawnInfoChip type="soil" value="KC Heavy Clay Soil" />}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-light px-3 py-1 font-mono text-xs text-forest">
              <Thermometer size={12} />
              Soil Temp: {soilTemp}
            </span>
          </div>

          {/* Seasonal action card — KC only */}
          {isKC && (
            <div className="rounded-xl bg-orange p-4 text-white text-left">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle size={16} />
                <span className="font-mono text-xs uppercase tracking-wider">
                  {seasonal.label}
                </span>
              </div>
              <p className="font-display text-xl">
                {seasonal.headline}
              </p>
              <p className="text-sm text-white/80 mt-1">
                {seasonal.body}
              </p>
            </div>
          )}

          {/* Savings comparison */}
          <div className="rounded-xl border border-border bg-white p-5 text-left">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">
              What You&apos;re Paying vs. DIY
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="font-display text-2xl text-muted">~$527</p>
                <p className="font-mono text-[10px] text-muted">TruGreen/yr</p>
              </div>
              <div>
                <p className="font-display text-2xl text-lime">~$154</p>
                <p className="font-mono text-[10px] text-muted">DIY w/ plan/yr</p>
              </div>
              <div>
                <p className="font-display text-2xl text-forest">~$373</p>
                <p className="font-mono text-[10px] text-forest font-medium">
                  You save/yr
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleCtaClick}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-lime px-6 py-3 font-display text-lg text-white uppercase tracking-wider hover:bg-lime/90 transition-colors"
          >
            Save Your Zone — Create Free Account
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      <CreateAccountModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleAccountCreated}
        entryPoint="zip-hook"
        prefillData={{ zipCode: zip || undefined }}
      />
    </div>
  );
}
