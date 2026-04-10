"use client";

import { useState, useEffect } from "react";

export interface UserStateResult {
  /** True while localStorage is being read on mount — use to avoid flash of wrong state */
  loading: boolean;
  isGuest: boolean;
  isFree: boolean;
  isPaid: boolean;
  lawnSqft: number | null;
  grassType: string | null;
  zip: string | null;
  email: string | null;
  /** Transition to free account (after email signup) */
  markFree: (email: string) => void;
  /** Transition to paid (stub — will be replaced by Stripe webhook) */
  markPaid: () => void;
}

export function useUserState(): UserStateResult {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<"guest" | "free" | "paid">("guest");
  const [lawnSqft, setLawnSqft] = useState<number | null>(null);
  const [grassType, setGrassType] = useState<string | null>(null);
  const [zip, setZip] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const userState = localStorage.getItem("tt_user_state");
    if (userState === "paid") setState("paid");
    else if (userState === "free") setState("free");
    else setState("guest");

    const sqft = localStorage.getItem("tt_sqft");
    if (sqft && Number(sqft) > 0) setLawnSqft(Number(sqft));

    const grass = localStorage.getItem("tt_grass");
    if (grass) setGrassType(grass);

    const z = localStorage.getItem("tt_zip");
    if (z) setZip(z);

    const e = localStorage.getItem("tt_email");
    if (e) setEmail(e);

    setLoading(false);
  }, []);

  function markFree(userEmail: string) {
    localStorage.setItem("tt_user_state", "free");
    localStorage.setItem("tt_email", userEmail);
    setState("free");
    setEmail(userEmail);
  }

  function markPaid() {
    localStorage.setItem("tt_user_state", "paid");
    setState("paid");
  }

  return {
    loading,
    isGuest: state === "guest",
    isFree: state === "free",
    isPaid: state === "paid",
    lawnSqft,
    grassType,
    zip,
    email,
    markFree,
    markPaid,
  };
}
