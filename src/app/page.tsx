"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import LawnInfoChip from "@/components/ui/LawnInfoChip";
import { MapPin, Leaf, Thermometer, AlertTriangle, ArrowRight } from "lucide-react";

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

export default function LandingPage() {
  const [zip, setZip] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isKC, setIsKC] = useState(false);

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

  return (
    <>
      <Nav userState="guest" />

      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* ZIP Code First-Value Hook */}
        <section className="text-center">
          <h1 className="font-display text-hero text-forest">
            What&apos;s Your Kansas City Lawn Dealing With?
          </h1>

          <div className="mt-6 mx-auto max-w-xs">
            <input
              type="text"
              inputMode="numeric"
              value={zip}
              onChange={(e) => handleZipChange(e.target.value)}
              placeholder="Enter ZIP code"
              className="w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-center font-mono text-lg text-charcoal placeholder:text-muted/50 focus:border-lime focus:outline-none transition-colors"
            />
          </div>

          {/* Zone chips */}
          {submitted && (
            <div className="mt-6 space-y-4">
              <div className="flex flex-wrap justify-center gap-2">
                <LawnInfoChip type="zone" value={isKC ? "Zone 6a — KC Metro" : "Zone 6a"} />
                {isKC && <LawnInfoChip type="soil" value="Heavy Clay Soil" />}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-light px-3 py-1 font-mono text-xs text-forest">
                  <Thermometer size={12} />
                  Soil Temp: ~48°F
                </span>
              </div>

              {/* Seasonal action card */}
              <div className="rounded-xl bg-orange p-4 text-white text-left">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle size={16} />
                  <span className="font-mono text-xs uppercase tracking-wider">
                    April Action
                  </span>
                </div>
                <p className="font-display text-xl">
                  Pre-Emergent Window Closing — Act Now
                </p>
                <p className="text-sm text-white/80 mt-1">
                  Soil temps are crossing 55°F in KC. Your crabgrass pre-emergent
                  window is closing fast.
                </p>
              </div>

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
              <a
                href="/plan"
                className="inline-flex items-center gap-2 rounded-xl bg-lime px-6 py-3 font-display text-lg text-white uppercase tracking-wider hover:bg-lime/90 transition-colors"
              >
                Save Your Zone — Create Free Account
                <ArrowRight size={18} />
              </a>
            </div>
          )}
        </section>

        {/* Value prop section */}
        <section className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: <Leaf size={24} className="text-lime" />,
              title: "Zone 6a Timing",
              desc: "Every task timed to KC soil temps, not national averages. Pre-emergent when forsythia blooms — not when a calendar says.",
            },
            {
              icon: <MapPin size={24} className="text-lime" />,
              title: "KC Clay Soil",
              desc: "Product rates and techniques built for heavy clay. No sand-mixing myths. Real aeration schedules for compacted KC ground.",
            },
            {
              icon: <AlertTriangle size={24} className="text-orange" />,
              title: "JoCo Blackout Law",
              desc: "Johnson County fertilizer blackout dates built into every schedule. Never get fined for a mistimed application.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-border bg-white p-5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-light mb-3">
                {card.icon}
              </div>
              <h3 className="font-display text-lg text-forest">{card.title}</h3>
              <p className="text-sm text-muted mt-1 leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </section>

        {/* FAQ preview */}
        <section className="mt-16 mb-16">
          <h2 className="font-display text-2xl text-forest text-center">
            KC Lawn Questions — Answered
          </h2>
          <div className="mt-6 space-y-3">
            {[
              "When should I apply pre-emergent in Kansas City?",
              "How do I deal with Kansas City's heavy clay soil?",
              "What is the Johnson County fertilizer blackout period?",
            ].map((q) => (
              <div
                key={q}
                className="rounded-xl border border-border bg-white px-5 py-4"
              >
                <p className="text-sm font-medium text-charcoal">{q}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <a
              href="/faq"
              className="inline-flex items-center gap-1 text-sm text-lime hover:text-forest transition-colors"
            >
              See all 17+ answers <ArrowRight size={14} />
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
