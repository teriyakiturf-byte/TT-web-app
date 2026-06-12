"use client";

import { useEffect, useState } from "react";

interface FertilizerWaitlistCardProps {
  /** Pre-fill the email field with the user's account email when available. */
  userEmail?: string | null;
}

type Status = "idle" | "submitting" | "joined" | "already";

// Year 2 private-label fertilizer pre-sell card. Rendered at the bottom of the
// dashboard for paid users only (gating handled by the parent).
export default function FertilizerWaitlistCard({
  userEmail,
}: FertilizerWaitlistCardProps) {
  const [email, setEmail] = useState(userEmail ?? "");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState<number | null>(null);

  // Keep the field in sync once the session email resolves.
  useEffect(() => {
    if (userEmail) setEmail((prev) => prev || userEmail);
  }, [userEmail]);

  // Live waitlist count (floored server-side to 23 while signups are low).
  useEffect(() => {
    let active = true;
    fetch("/api/waitlist/fertilizer")
      .then((r) => r.json())
      .then((d) => {
        if (active && typeof d?.count === "number") setCount(d.count);
      })
      .catch(() => {
        /* non-critical — counter just stays hidden */
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Enter your email address.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/waitlist/fertilizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("idle");
        setError(
          data?.error === "INVALID_EMAIL"
            ? "Enter a valid email address."
            : "Something went wrong. Please try again."
        );
        return;
      }

      if (data?.status === "already") {
        setStatus("already");
      } else {
        setStatus("joined");
        setCount((c) => (c === null ? c : c + 1));
      }
    } catch {
      setStatus("idle");
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="mt-8 mb-8">
      {/* Counter */}
      {count !== null && (
        <p className="text-sm text-[#52B788] font-medium text-center mb-3">
          {count.toLocaleString()} KC homeowners already on the waitlist
        </p>
      )}

      {/* Card */}
      <div className="bg-[#1B4332] rounded-2xl p-5 mt-6">
        <p className="text-xs font-bold text-[#95D5B2] uppercase tracking-widest mb-2">
          Coming Spring 2027
        </p>
        <h3 className="text-xl font-bold text-white mb-1">
          Teriyaki Turf Zone 6a Clay Blend
        </h3>
        <p className="text-sm text-[#95D5B2] mb-4">
          A private-label fertilizer built specifically for KC heavy clay soil.
          No more guessing which bag works here.
        </p>

        {status === "joined" ? (
          <p className="text-sm text-[#95D5B2] text-center">
            You&apos;re on the list. We&apos;ll reach out before anyone else.
          </p>
        ) : status === "already" ? (
          <p className="text-sm text-[#95D5B2] text-center">
            You&apos;re already on the list!
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              aria-label="Your email address"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 text-sm mb-3"
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full bg-[#F4631E] text-white font-bold rounded-xl py-3 text-sm disabled:opacity-70"
            >
              {status === "submitting" ? "Joining…" : "Join the Waitlist →"}
            </button>
            {error && (
              <p className="text-xs text-orange-200 text-center mt-2">{error}</p>
            )}
            <p className="text-xs text-[#95D5B2] text-center mt-2">
              You&apos;ll get early access + a founding member discount.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
