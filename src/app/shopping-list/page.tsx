"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ExternalLink } from "lucide-react";
import Nav from "@/components/Nav";
import { useUserState } from "@/hooks/useUserState";
import { getTasksWithCompletions, buildShoppingList } from "@/lib/planTasks";

/* Badge color per task type, matching the Products / Checklist palette. */
const TYPE_BADGE: Record<string, string> = {
  fertilizer: "bg-[#D8F3DC] text-[#1B4332]",
  "weed-pest": "bg-[#FFF0EB] text-[#F4631E]",
  mechanical: "bg-[#FEF9C3] text-[#854D0E]",
};

const TYPE_LABEL: Record<string, string> = {
  fertilizer: "Fertilizer",
  "weed-pest": "Weed & Pest",
  mechanical: "Mechanical",
};

export default function ShoppingListPage() {
  const router = useRouter();
  const { isPaid, isGuest, loading, lawnSqft } = useUserState();

  // Same task source as the dashboard/checklist so the buy list stays in sync.
  const [tasks] = useState(() => getTasksWithCompletions());

  // Access control: free/guest get an empty, locked result — product names and
  // quantities never reach the client list for them (B12).
  const { products, isLocked } = useMemo(
    () => buildShoppingList(tasks, lawnSqft, isPaid),
    [tasks, lawnSqft, isPaid]
  );

  // Guests have no account to gate — send them to sign in (then back here).
  if (!loading && isGuest && typeof window !== "undefined") {
    router.push("/signin?callbackUrl=/shopping-list");
  }

  return (
    <>
      <Nav />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="pb-5 mb-5 border-b-2 border-border">
          <h1 className="font-display text-hero text-forest text-center">
            Your Shopping List
          </h1>
          <p className="text-sm text-muted text-center mt-2 max-w-lg mx-auto">
            Everything you still need to buy — totaled for your lawn, in the
            order you&apos;ll use it.
          </p>
        </div>

        {isLocked ? (
          /* ── Free-user locked state (B12) ── */
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <div className="text-4xl mb-3" aria-hidden="true">
              🔒
            </div>
            <h2 className="text-lg font-bold text-[#1B4332] text-center mb-2">
              Your shopping list is part of your full plan.
            </h2>
            <p className="text-sm text-gray-500 text-center mb-6 max-w-sm">
              Unlock your plan to see exactly what to buy, how much, and where to
              get it in KC.
            </p>
            <button
              onClick={() => router.push("/plan")}
              className="bg-[#F4631E] text-white font-bold rounded-xl px-6 py-3 text-sm"
            >
              Unlock My Full Plan — $67 →
            </button>
          </div>
        ) : products.length === 0 ? (
          /* ── Paid user, nothing left to buy ── */
          <div className="text-center py-12">
            <p className="font-display text-2xl text-forest">
              Nothing left to buy
            </p>
            <p className="text-sm text-muted mt-2">
              You&apos;ve checked off every product task. New items appear here
              as your next windows open.
            </p>
            <Link
              href="/checklist"
              className="mt-4 inline-block text-sm text-lime hover:text-forest transition-colors"
            >
              View your checklist →
            </Link>
          </div>
        ) : (
          /* ── Paid user buy list ── */
          <>
            {!lawnSqft && (
              <div className="mb-6 rounded-xl border-2 border-dashed border-orange/40 bg-orange-light p-4 text-center">
                <p className="text-sm text-charcoal">
                  Add your lawn size to see <strong>exact quantities</strong> for
                  each product.
                </p>
                <Link
                  href="/measure"
                  className="mt-2 inline-block rounded-lg bg-orange px-4 py-2 font-display text-sm text-white uppercase tracking-wider hover:bg-orange/90 transition-colors"
                >
                  Measure My Lawn →
                </Link>
              </div>
            )}

            <p className="font-mono text-xs text-muted uppercase tracking-wide mb-3">
              {products.length} product{products.length === 1 ? "" : "s"} to buy
            </p>

            <div className="space-y-3">
              {products.map((p) => (
                <div
                  key={p.productName}
                  className="rounded-xl border border-border bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span
                        className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                          TYPE_BADGE[p.taskType] ?? "bg-cream text-muted"
                        }`}
                      >
                        {TYPE_LABEL[p.taskType] ?? p.taskType}
                      </span>
                      <h3 className="font-display text-lg text-forest leading-tight mt-2">
                        {p.productName}
                      </h3>
                      <p className="text-xs text-muted mt-1">
                        {p.applicationNotes}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-display text-xl text-lime">
                        {p.quantity}
                      </p>
                      <p className="font-mono text-[10px] text-muted uppercase tracking-wide mt-0.5">
                        {p.applications} application
                        {p.applications === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-border">
                    <span className="font-mono text-[10px] text-muted">
                      First needed: {p.dueRange ?? p.dueDate}
                    </span>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-1 rounded-full bg-forest text-white text-xs px-3.5 py-1.5 hover:bg-forest/90 transition-colors"
                    >
                      <ExternalLink size={10} />
                      Where to buy
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted">
              <Lock size={11} />
              Quantities calculated for your lawn · Zone 6a · KC clay
            </p>
          </>
        )}
      </main>
    </>
  );
}
