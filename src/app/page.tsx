import type { Metadata } from "next";
import { Leaf, MapPin, Thermometer, ArrowRight } from "lucide-react";
import Nav from "@/components/Nav";
import ZipHook from "@/components/ZipHook";
import SavingsCounter from "@/components/SavingsCounter";

export const metadata: Metadata = {
  title: "Kansas City Lawn Care — Zone 6a Schedule & KC Soil Temperature Guide | Teriyaki Turf",
  description:
    "KC-specific lawn care for Zone 6a homeowners. Soil temperature triggered task timing, KC clay soil rates, and fall overseeding calendar. Free tools at teriyakiturf.com.",
  keywords: [
    "Kansas City lawn care",
    "KC lawn plan",
    "Zone 6a lawn schedule",
    "KC soil temperature lawn care",
    "KC clay soil lawn",
    "tall fescue Kansas City",
    "pre-emergent KC",
    "DIY lawn care Kansas City",
  ],
  openGraph: {
    title: "Teriyaki Turf – KC Lawn Care Intelligence",
    description:
      "Free tools for Kansas City lawns. Zone 6a calendar, clay soil guides, soil temp triggers. Real advice from a real KC homeowner.",
    url: "https://teriyakiturf.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Teriyaki Turf – KC Lawn Care Intelligence",
    description:
      "Hyperlocal lawn care for Kansas City homeowners. Zone 6a. Clay soil. Real talk.",
  },
  alternates: {
    canonical: "https://teriyakiturf.com",
  },
};

export default function LandingPage() {
  return (
    <>
      <Nav userState="guest" />

      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Hero — static, in initial HTML */}
        <section className="text-center">
          {/* Geographic identity badge (F2) — left-aligned, above the fold */}
          <div className="flex justify-start mb-3">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white bg-[#F4631E]">
              📍 Built for Kansas City
            </span>
          </div>

          <h1 className="font-display text-hero text-forest">
            Your neighbor&apos;s lawn isn&apos;t better than yours because they work harder.
            <br />
            It&apos;s because they know something about Zone 6a clay soil that you don&apos;t. Yet.
          </h1>
          <p className="text-sm text-muted mt-2 max-w-lg mx-auto">
            TruGreen charges KC homeowners $623–$847/year to apply the same plan
            you&apos;re about to build in 60 seconds. For free.
          </p>

          {/* Savings counter (#2) — above the fold, above the ZIP input */}
          <div className="mt-6 max-w-md mx-auto">
            <SavingsCounter />
          </div>

          {/* Interactive ZIP hook — client island */}
          <div className="mt-2">
            <ZipHook />
          </div>
        </section>

        {/* Value prop cards — static HTML, no JS needed */}
        <section className="mt-16 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-white p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-light mb-3">
              <Leaf size={24} className="text-lime" />
            </div>
            <h3 className="font-display text-lg text-forest">Zone 6a Timing</h3>
            <p className="text-sm text-muted mt-1 leading-relaxed">
              Every task timed to KC soil temps, not national averages.
              Pre-emergent when forsythia blooms — not when a calendar says.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-white p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-light mb-3">
              <MapPin size={24} className="text-lime" />
            </div>
            <h3 className="font-display text-lg text-forest">KC Clay Soil</h3>
            <p className="text-sm text-muted mt-1 leading-relaxed">
              Product rates and techniques built for heavy clay. No sand-mixing
              myths. Real aeration schedules for compacted KC ground.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-white p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-light mb-3">
              <Thermometer size={24} className="text-lime" />
            </div>
            <h3 className="font-display text-lg text-forest">KC Soil Temperature</h3>
            <p className="text-sm text-muted mt-1 leading-relaxed">
              Every task triggered by live KC soil temps — not generic calendar
              dates. Pre-emergent when soil hits 50°F. Overseeding when it drops
              below 65°F.
            </p>
          </div>
        </section>

        {/* Competitive differentiation — static HTML */}
        <section className="mt-16">
          <h2 className="text-xl font-bold text-[#1B4332] mb-2">
            Why not just use a free lawn app?
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            Fair question. Here is the honest difference.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1 — Free Generic Apps */}
            <div className="rounded-xl overflow-hidden border border-gray-200">
              <div className="bg-gray-100 text-gray-600 font-bold px-4 py-3 text-sm">
                Free Lawn Apps
              </div>
              <div className="text-gray-500 text-sm px-4 py-2 border-t border-gray-100">
                ✗&nbsp;&nbsp;Built for national averages — not KC clay soil
              </div>
              <div className="text-gray-500 text-sm px-4 py-2 border-t border-gray-100">
                ✗&nbsp;&nbsp;Timing based on climate zone, not your ZIP code
              </div>
              <div className="text-gray-500 text-sm px-4 py-2 border-t border-gray-100">
                ✗&nbsp;&nbsp;Product amounts not calibrated for your lawn size
              </div>
              <div className="text-gray-500 text-sm px-4 py-2 border-t border-gray-100">
                ✗&nbsp;&nbsp;No local competitor pricing context
              </div>
              <div className="text-gray-500 text-sm px-4 py-2 border-t border-gray-100">
                ✗&nbsp;&nbsp;Free because they sell services or your data
              </div>
            </div>

            {/* Card 2 — Teriyaki Turf */}
            <div className="rounded-xl overflow-hidden border border-gray-200">
              <div className="bg-[#1B4332] text-white font-bold px-4 py-3 text-sm">
                Teriyaki Turf
              </div>
              <div className="text-[#1B4332] font-medium text-sm px-4 py-2 border-t border-gray-100">
                ✓&nbsp;&nbsp;Built specifically for Zone 6a KC clay soil
              </div>
              <div className="text-[#1B4332] font-medium text-sm px-4 py-2 border-t border-gray-100">
                ✓&nbsp;&nbsp;Timing calibrated to real KC soil temperature data
              </div>
              <div className="text-[#1B4332] font-medium text-sm px-4 py-2 border-t border-gray-100">
                ✓&nbsp;&nbsp;Exact quantities for your specific lawn size
              </div>
              <div className="text-[#1B4332] font-medium text-sm px-4 py-2 border-t border-gray-100">
                ✓&nbsp;&nbsp;DIY savings vs. actual KC lawn care company pricing
              </div>
              <div className="text-[#1B4332] font-medium text-sm px-4 py-2 border-t border-gray-100">
                ✓&nbsp;&nbsp;One-time $67 — no subscription, no service upsell, ever
              </div>
            </div>
          </div>

          <p className="text-sm text-center text-[#52B788] font-medium mt-4">
            Free apps are built for everywhere. This one is built for here.
          </p>
        </section>

        {/* FAQ preview — static HTML */}
        <section className="mt-16 mb-16">
          <h2 className="font-display text-2xl text-forest text-center">
            KC Lawn Questions — Answered
          </h2>
          <div className="mt-6 space-y-3">
            <div className="rounded-xl border border-border bg-white px-5 py-4">
              <p className="text-sm font-medium text-charcoal">
                When should I apply pre-emergent in Kansas City?
              </p>
            </div>
            <div className="rounded-xl border border-border bg-white px-5 py-4">
              <p className="text-sm font-medium text-charcoal">
                How do I deal with Kansas City&apos;s heavy clay soil?
              </p>
            </div>
            <div className="rounded-xl border border-border bg-white px-5 py-4">
              <p className="text-sm font-medium text-charcoal">
                Why does soil temperature matter more than the calendar date?
              </p>
            </div>
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
