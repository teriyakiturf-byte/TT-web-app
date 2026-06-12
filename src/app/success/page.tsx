"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/components/Nav";
import { useUserState } from "@/hooks/useUserState";
import { getCityFromZip } from "@/lib/utils";
import {
  PLAN_TASKS,
  TASK_COMPLETIONS_KEY,
  loadTaskCompletions,
  selectHeroTask,
  formatTaskQuantity,
} from "@/lib/planTasks";
import type { LawnTask } from "@/types";

const SHARE_URL = "https://teriyakiturf.com";
const SHARE_TEXT =
  "I just put my lawn on a real system with Teriyaki Turf — KC-specific plan, exact product quantities, soil-temp timing. Beats paying TruGreen $800/year.";

export default function SuccessPage() {
  const router = useRouter();
  const { lawnSqft, zip } = useUserState();

  // Completion state is read once on mount (localStorage is client-only) and
  // updated locally when the user marks the hero task done on this screen.
  const [completions, setCompletions] = useState<Record<string, boolean> | null>(
    null
  );
  const [shareToast, setShareToast] = useState<string | null>(null);

  useEffect(() => {
    setCompletions(loadTaskCompletions());
  }, []);

  const heroTask: LawnTask | undefined = useMemo(() => {
    if (!completions) return undefined;
    const tasks = PLAN_TASKS.map((t) => ({
      ...t,
      isComplete: completions[t.id] ?? false,
    }));
    return selectHeroTask(tasks);
  }, [completions]);

  const userCity = getCityFromZip(zip ?? "");

  function handleSeeFullPlan() {
    router.push("/dashboard");
  }

  function handleMarkDone() {
    if (!heroTask) return;
    const next = { ...(completions ?? {}), [heroTask.id]: true };
    setCompletions(next);
    try {
      localStorage.setItem(TASK_COMPLETIONS_KEY, JSON.stringify(next));
    } catch {
      /* ignore persistence failures — UI still advances */
    }
  }

  async function handleShare() {
    const shareData = {
      title: "Teriyaki Turf",
      text: SHARE_TEXT,
      url: SHARE_URL,
    };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
        return;
      }
    } catch {
      // User cancelled the share sheet, or it failed — fall through to copy.
      return;
    }
    // Fallback: copy the link to the clipboard.
    try {
      await navigator.clipboard.writeText(`${SHARE_TEXT} ${SHARE_URL}`);
      setShareToast("Link copied to clipboard ✓");
      setTimeout(() => setShareToast(null), 2500);
    } catch {
      setShareToast("Couldn't copy — share manually: " + SHARE_URL);
      setTimeout(() => setShareToast(null), 3500);
    }
  }

  // ── Fallback: task data unavailable (still loading, all tasks done, or
  //    nothing could be selected). Show headline + subhead + a plan button.
  const showFallback = completions === null || !heroTask;

  const quantity = heroTask
    ? formatTaskQuantity(lawnSqft, heroTask.labelRate)
    : "";

  return (
    <>
      <Nav userState="paid" />

      <main className="mx-auto w-full max-w-md overflow-x-hidden pb-12">
        {/* 1. HEADLINE */}
        <h1 className="text-3xl font-bold text-[#1B4332] text-center mt-8 mb-2">
          You&apos;re in. Zone 6a Done Right.
        </h1>

        {/* 2. SUBHEAD */}
        <p className="text-base text-gray-600 text-center mb-6 px-4">
          Your full plan is unlocked. Based on your ZIP and grass type,
          here&apos;s what matters most this week:
        </p>

        {showFallback ? (
          /* FALLBACK — no task data; never throw, just offer the full plan. */
          <div className="px-4">
            <button
              onClick={handleSeeFullPlan}
              className="w-full rounded-2xl bg-[#F4631E] text-white py-3 text-base font-medium"
            >
              See My Full Plan →
            </button>
          </div>
        ) : (
          <>
            {/* 3. HERO TASK CARD */}
            <div className="bg-[#1B4332] text-white rounded-2xl p-5 mx-4 mb-6">
              <p className="text-xs font-bold text-[#95D5B2] uppercase tracking-widest mb-2">
                This Week in {userCity}
              </p>
              <h2 className="text-xl font-bold text-white mb-1">
                {heroTask.name}
              </h2>
              <p className="text-sm text-[#95D5B2] mb-3">
                {heroTask.applicationNotes}
              </p>
              <p className="text-sm text-[#F9E2AF]">
                Product: {heroTask.productName}
              </p>
              <p className="text-sm text-[#F9E2AF]">
                Amount: {quantity} for your lawn
              </p>
              <div className="flex justify-between mt-3">
                <span className="text-xs text-[#95D5B2]">
                  Est. {heroTask.estTimeMin ?? 30} min
                </span>
                <span className="text-xs text-[#95D5B2]">
                  Cost: ${heroTask.estCost ?? 0}
                </span>
              </div>
            </div>

            {/* Hero card action buttons (stacked, full width) */}
            <div className="px-4 mb-6 space-y-3">
              <button
                onClick={handleSeeFullPlan}
                className="w-full rounded-2xl bg-[#F4631E] text-white py-3 text-base font-medium"
              >
                See Full Plan →
              </button>
              <button
                onClick={handleMarkDone}
                className="w-full rounded-2xl border border-[#52B788] text-[#52B788] bg-transparent py-3 text-base font-medium"
              >
                Mark as Done
              </button>
            </div>
          </>
        )}

        {/* 4. ENCOURAGEMENT TEXT */}
        <p className="text-sm text-gray-500 text-center mx-4 mb-6">
          Your lawn is now on a system. Most KC homeowners who follow this plan
          see visible improvement within 6–8 weeks.
        </p>

        {/* 5. SHARE PROMPT */}
        <p className="text-sm text-center text-gray-600 mb-2 px-4">
          Know someone paying TruGreen $800/year? 👇
        </p>
        <button
          onClick={handleShare}
          className="border border-[#52B788] text-[#52B788] rounded-full px-6 py-2 text-sm font-medium mx-auto block"
        >
          Share Teriyaki Turf →
        </button>
        {shareToast && (
          <p className="text-xs text-center text-gray-500 mt-3 px-4">
            {shareToast}
          </p>
        )}
      </main>
    </>
  );
}
