import type { Metadata } from "next";
import { Leaf, MapPin, Thermometer, ArrowRight } from "lucide-react";
import Nav from "@/components/Nav";
import ZipHook from "@/components/ZipHook";

export const metadata: Metadata = {
  title: "Teriyaki Turf | Kansas City Lawn Care Plan — Zone 6a, Clay Soil, Soil Temps",
  description:
    "Free lawn care tools built for Kansas City homeowners. Zone 6a seasonal calendar, KC clay soil guides, soil temperature triggers, and product calculators. Save $373/year vs. TruGreen.",
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
          <h1 className="font-display text-hero text-forest">
            What&apos;s Your Kansas City Lawn Dealing With?
          </h1>
          <p className="text-sm text-muted mt-2 max-w-lg mx-auto">
            Zone 6a timing. KC clay soil. Soil temp triggers. Built for KC homeowners.
          </p>

          {/* Interactive ZIP hook — client island */}
          <div className="mt-6">
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
