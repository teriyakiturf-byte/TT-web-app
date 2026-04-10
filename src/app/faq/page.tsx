import type { Metadata } from "next";
import Nav from "@/components/Nav";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "KC Lawn Care FAQ — Zone 6a, Clay Soil, JoCo Law | Teriyaki Turf",
  description:
    "Answers to common Kansas City lawn care questions. Pre-emergent timing, clay soil tips, Johnson County fertilizer blackout dates, and more for Zone 6a homeowners.",
};

const FAQ_ITEMS = [
  {
    q: "When should I apply pre-emergent in Kansas City?",
    a: "When soil temperatures consistently reach 50–55°F, typically mid-March to early April in the KC metro. Watch forsythia blooms as your natural indicator — when they start blooming, it's time. Use a split application (half rate in March, half in April) for extended protection through summer.",
  },
  {
    q: "How do I deal with Kansas City's heavy clay soil?",
    a: "Core aerate every fall (September is ideal). Don't add sand — it creates concrete-like conditions in clay. Use gypsum to improve drainage over time. Mow high (3.5–4 inches) to encourage deeper root growth that breaks through compacted soil. Milorganite is a great fertilizer choice for clay because it won't burn.",
  },
  {
    q: "What is the Johnson County fertilizer blackout period?",
    a: "Johnson County restricts fertilizer applications containing phosphorus near waterways. The blackout typically runs November 15 through March 1. Always check current JoCo regulations before applying any fertilizer during shoulder months. Our plan has these dates built into every schedule automatically.",
  },
  {
    q: "What type of grass do most KC lawns have?",
    a: "Most Kansas City lawns are Tall Fescue — a cool-season grass well-suited to Zone 6a's hot summers and cold winters. Some lawns have Kentucky Bluegrass or a Zoysia/Bermuda mix. If you're unsure, Tall Fescue is the safe assumption for product rates and timing.",
  },
  {
    q: "When should I overseed my KC lawn?",
    a: "September 1–20 is the prime window for overseeding Tall Fescue in Kansas City. Soil temps are still warm enough for germination, but air temps are cooling down. Core aerate immediately before overseeding for best seed-to-soil contact. Keep the seed moist for 2–3 weeks.",
  },
  {
    q: "How often should I water my lawn in Kansas City?",
    a: "Water deeply and infrequently — 1 to 1.5 inches per week total, including rain. In summer, this usually means 2–3 deep waterings per week rather than daily light sprinkles. Water early morning (before 10 AM) to reduce fungal disease risk. KC's clay soil holds moisture longer than sandy soils.",
  },
  {
    q: "What's the best mowing height for KC lawns?",
    a: "For Tall Fescue in KC: mow at 3.5 inches in spring and fall, raise to 4 inches in summer. Never remove more than one-third of the blade height at once. Taller grass shades the soil, reducing weed germination and water evaporation — critical during KC's hot July/August.",
  },
];

export default function FAQPage() {
  return (
    <>
      <Nav userState="guest" />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="font-display text-hero text-forest text-center">
          KC Lawn Questions — Answered
        </h1>
        <p className="text-sm text-muted text-center mt-2">
          Real answers for Kansas City Zone 6a homeowners. No generic advice.
        </p>

        <div className="mt-8 space-y-4">
          {FAQ_ITEMS.map((item, i) => (
            <details
              key={i}
              className="group rounded-xl border border-border bg-white overflow-hidden"
              open={i < 3}
            >
              <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-medium text-charcoal hover:bg-cream transition-colors list-none">
                {item.q}
                <ArrowRight
                  size={14}
                  className="flex-shrink-0 ml-3 text-muted transition-transform group-open:rotate-90"
                />
              </summary>
              <div className="px-5 pb-4">
                <p className="text-sm text-muted leading-relaxed">{item.a}</p>
              </div>
            </details>
          ))}
        </div>

        <div className="mt-8 rounded-xl bg-forest p-6 text-center text-white">
          <p className="font-display text-2xl">
            Get Your Personalized KC Lawn Plan
          </p>
          <p className="text-sm text-white/70 mt-2">
            Every task timed to Zone 6a. Product quantities calculated for your lawn size.
          </p>
          <a
            href="/plan"
            className="mt-4 inline-block rounded-xl bg-orange px-6 py-3 font-display text-lg text-white uppercase tracking-wider hover:bg-orange/90 transition-colors"
          >
            See My Plan →
          </a>
        </div>
      </main>
    </>
  );
}
