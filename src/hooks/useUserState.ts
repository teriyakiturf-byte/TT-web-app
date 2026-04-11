"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export interface UserStateResult {
  /** True while session + localStorage are being read on mount */
  loading: boolean;
  isGuest: boolean;
  isFree: boolean;
  /** Server-verified paid status — cannot be faked via DevTools */
  isPaid: boolean;
  lawnSqft: number | null;
  grassType: string | null;
  zip: string | null;
  email: string | null;
  /** Transition to free account (after email signup) — updates localStorage for immediate UI */
  markFree: (email: string) => void;
}

export function useUserState(): UserStateResult {
  const { data: session, status } = useSession();
  const [lawnSqft, setLawnSqft] = useState<number | null>(null);
  const [grassType, setGrassType] = useState<string | null>(null);
  const [zip, setZip] = useState<string | null>(null);
  const [localEmail, setLocalEmail] = useState<string | null>(null);
  const [localState, setLocalState] = useState<"guest" | "free">("guest");

  // Read lawn preferences from localStorage (still client-side — not sensitive)
  useEffect(() => {
    const sqft = localStorage.getItem("tt_sqft");
    if (sqft && Number(sqft) > 0) setLawnSqft(Number(sqft));

    const grass = localStorage.getItem("tt_grass");
    if (grass) setGrassType(grass);

    const z = localStorage.getItem("tt_zip");
    if (z) setZip(z);

    const e = localStorage.getItem("tt_email");
    if (e) {
      setLocalEmail(e);
      setLocalState("free");
    }
  }, []);

  const loading = status === "loading";

  // Auth state: logged-in session takes priority over localStorage
  const isLoggedIn = status === "authenticated" && !!session?.user;
  const isPaid = isLoggedIn && !!(session.user as any).planPurchased;

  // Merge: DB user data overrides localStorage
  const effectiveEmail = isLoggedIn
    ? session.user?.email ?? null
    : localEmail;
  const effectiveSqft = isLoggedIn
    ? (session.user as any).lawnSqft ?? lawnSqft
    : lawnSqft;
  const effectiveGrass = isLoggedIn
    ? (session.user as any).grassType ?? grassType
    : grassType;
  const effectiveZip = isLoggedIn
    ? (session.user as any).zip ?? zip
    : zip;

  // Determine guest vs free vs paid
  const isGuest = !isLoggedIn && localState === "guest";
  const isFree = (isLoggedIn && !isPaid) || (!isLoggedIn && localState === "free");

  function markFree(userEmail: string) {
    localStorage.setItem("tt_user_state", "free");
    localStorage.setItem("tt_email", userEmail);
    setLocalState("free");
    setLocalEmail(userEmail);
  }

  return {
    loading,
    isGuest,
    isFree,
    isPaid,
    lawnSqft: effectiveSqft,
    grassType: effectiveGrass,
    zip: effectiveZip,
    email: effectiveEmail,
    markFree,
  };
}
