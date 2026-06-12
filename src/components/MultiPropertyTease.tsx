"use client";

import { useState, type FormEvent } from "react";
import { useUserState } from "@/hooks/useUserState";

type Status = "idle" | "form" | "submitting" | "success";

/**
 * Dashboard "Coming Soon" tease for a future multi-property dashboard.
 * Pure UI tease — tapping expands the card into an inline email capture that
 * posts to /api/multi-property-waitlist (Supabase/Prisma row + Kit tag).
 * Pre-fills the signed-in user's email when we have one.
 */
export default function MultiPropertyTease() {
  const { email } = useUserState();
  const [status, setStatus] = useState<Status>("idle");
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function openForm() {
    setValue(email ?? "");
    setError(null);
    setStatus("form");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Enter a valid email.");
      return;
    }
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/multi-property-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
    } catch {
      // Waitlist insert failed (e.g. table missing) — keep the form alive and
      // give the user a manual fallback instead of crashing the dashboard.
      setError("Something went wrong. You can email us to be added manually.");
      setStatus("form");
    }
  }

  return (
    <div className="bg-[#F5F1E8] border border-[#95D5B2] rounded-2xl p-4 mt-4">
      <p className="text-xs font-bold text-[#52B788] uppercase tracking-widest mb-1">
        Coming Soon
      </p>
      <h3 className="text-base font-bold text-[#1B4332] mb-1">
        Managing multiple properties?
      </h3>
      <p className="text-xs text-gray-500 mb-3">
        Multi-property dashboard is on the way. One account, all your KC lawns —
        rental properties, Airbnbs, and your own home.
      </p>

      {status === "success" ? (
        <p className="text-xs text-[#52B788] text-center">
          You&apos;re on the list. We&apos;ll notify you when it&apos;s ready.
        </p>
      ) : status === "idle" ? (
        <button
          type="button"
          onClick={openForm}
          className="w-full bg-[#1B4332] text-white font-bold rounded-xl py-2.5 text-sm"
        >
          Join the Waitlist →
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="email"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Your email (pre-filled if available)"
            autoFocus
            disabled={status === "submitting"}
            className="w-full rounded-xl border border-[#95D5B2] bg-white px-3 py-2.5 text-sm text-[#1B4332] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#52B788]/40 disabled:opacity-60"
          />
          {error && (
            <p className="text-sm text-[#F4631E] text-center mt-2">{error}</p>
          )}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full bg-[#1B4332] text-white font-bold rounded-xl py-2.5 text-sm disabled:opacity-60"
          >
            {status === "submitting" ? "Saving…" : "Notify Me"}
          </button>
        </form>
      )}
    </div>
  );
}
