import type { Metadata } from "next";
import Nav from "@/components/Nav";
import FaqAccordion, { type FaqItem } from "@/components/ui/FaqAccordion";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — KC Lawn Plan | Teriyaki Turf",
  description:
    "Real questions from Kansas City homeowners about the Teriyaki Turf lawn plan — one-time pricing, grass types, lawn measurement, overseeding timing, and KC clay soil.",
};

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Is this really just a one-time payment?",
    a: "Yes. $67 once and your plan is unlocked forever. No subscription, no annual renewal, no hidden fees. We think lawn care subscriptions are a racket — that's literally the whole point of this app.",
  },
  {
    q: "What makes this different from a free lawn app?",
    a: "Free lawn apps are built for national averages. Your lawn is in Kansas City, on Zone 6a heavy clay soil, with KC weather patterns. Generic timing and generic product rates don't work here. Every recommendation in your plan is calibrated to your specific ZIP code, your lawn size, and real KC soil temperature data.",
  },
  {
    q: "I don't know what kind of grass I have. Will this still work?",
    a: "Yes. Select 'Not Sure' in the grass type step and we'll build your plan around the most common KC grass type for your ZIP code — which is Tall Fescue in most of Johnson County. You can update your grass type in Settings anytime.",
  },
  {
    q: "How do I measure my lawn size?",
    a: "You don't have to be exact. Choose the closest size range in onboarding (Small / Medium / Large / XL) — that's accurate enough for the plan. If you want precise product quantities, use the optional map measurement tool in onboarding step 2.",
  },
  {
    q: "My lawn has a bare or patchy section. Does the plan cover that?",
    a: "Yes. Overseeding and renovation tasks are included in your plan with the correct timing window for KC — soil temp between 50–65°F, typically mid-September to mid-October. Follow the plan timing. Do not overseed in March in KC clay. The soil is too cold and seed won't germinate.",
  },
  {
    q: "I tried a lawn program before and it didn't work. Why will this be different?",
    a: "Most failed programs use the wrong timing for KC clay soil. KC clay stays cold longer than national averages suggest — pre-emergent applied too early gets washed out before it activates. Fertilizer applied when grass is stressed burns instead of feeds. This plan uses real KC soil temperature data to tell you when — not just what.",
  },
  {
    q: "What if I'm not happy with my plan?",
    a: "Email us and we'll make it right. This is Trever's personal lawn system — we stand behind it. We'd rather fix a plan than have you unhappy with it.",
  },
  {
    q: "Can I use this for a rental property or Airbnb?",
    a: "Yes. The plan works for any KC metro lawn. Enter the property's ZIP code during onboarding. If you manage multiple properties, you'll need a separate account per property for now. Multi-property dashboard is coming — join the waitlist from your dashboard.",
  },
  {
    q: "Will this work for Zoysia or Bermuda grass?",
    a: "The app is optimized for cool-season grasses — Tall Fescue, Kentucky Bluegrass, and Perennial Ryegrass — which cover the vast majority of KC metro lawns. Zoysia support is included. Bermuda (warm-season) has different timing and is on our roadmap.",
  },
  {
    q: "When will my plan update for the new season?",
    a: "Your plan updates automatically based on the current date and your ZIP code's soil temperature data. You don't need to do anything — just open the app and your current tasks will reflect the season you're in.",
  },
];

export default function FAQPage() {
  return (
    <>
      <Nav userState="guest" />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="font-body normal-case tracking-normal text-2xl font-bold text-[#1B4332] mb-2">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Real questions from KC homeowners. Real answers.
        </p>

        <FaqAccordion items={FAQ_ITEMS} />

        <div className="mt-8 rounded-xl bg-forest p-6 text-center text-white">
          <p className="font-display text-2xl">
            Get Your Personalized KC Lawn Plan
          </p>
          <p className="text-sm text-white/70 mt-2">
            Every task timed to Zone 6a. Product quantities calculated for your
            lawn size.
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
