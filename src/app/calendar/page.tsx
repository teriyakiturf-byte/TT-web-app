"use client";

import Nav from "@/components/Nav";
import { useUserState } from "@/hooks/useUserState";

export default function CalendarPage() {
  const { isPaid } = useUserState();

  return (
    <>
      <Nav userState={isPaid ? "paid" : "free"} />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="font-display text-hero text-forest text-center">
          Calendar
        </h1>
        <p className="text-sm text-muted text-center mt-2">
          Visual schedule for your KC lawn care year.
        </p>

        <div className="mt-8 rounded-xl border border-border bg-white p-8 text-center">
          <p className="font-display text-2xl text-forest">Coming Soon</p>
          <p className="text-sm text-muted mt-2">
            Your 12-month visual calendar is being built. Check back soon.
          </p>
          <a
            href="/checklist"
            className="mt-4 inline-block rounded-xl bg-lime px-6 py-3 font-display text-lg text-white uppercase tracking-wider hover:bg-lime/90 transition-colors"
          >
            View Checklist Instead
          </a>
        </div>
      </main>
    </>
  );
}
