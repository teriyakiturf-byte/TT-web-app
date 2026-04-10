"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import Nav from "@/components/Nav";
import { useUserState } from "@/hooks/useUserState";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { markPaid } = useUserState();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    // Verify the checkout session server-side
    async function verifyPayment() {
      try {
        const res = await fetch(`/api/stripe/verify?session_id=${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.paid) {
            markPaid();
            setStatus("success");
          } else {
            setStatus("error");
          }
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    }

    verifyPayment();
  }, [sessionId, markPaid]);

  if (status === "verifying") {
    return (
      <div className="text-center py-16">
        <Loader2 size={40} className="animate-spin text-lime mx-auto" />
        <p className="text-sm text-muted mt-4">Verifying your payment...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center py-16">
        <h1 className="font-display text-hero text-forest">
          Something Went Wrong
        </h1>
        <p className="text-sm text-muted mt-2 max-w-sm mx-auto">
          We couldn&apos;t verify your payment. If you were charged, your plan will unlock automatically within a few minutes.
        </p>
        <button
          onClick={() => router.push("/plan")}
          className="mt-6 rounded-xl bg-lime px-6 py-3 font-display text-lg text-white uppercase tracking-wider hover:bg-lime/90 transition-colors"
        >
          Go to My Plan →
        </button>
      </div>
    );
  }

  return (
    <div className="text-center py-16">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-lime">
        <Check size={32} className="text-white" strokeWidth={3} />
      </div>

      <h1 className="font-display text-hero text-forest">
        You&apos;re In
      </h1>
      <p className="text-sm text-muted mt-2 max-w-sm mx-auto">
        Your KC lawn plan is fully unlocked. Every task, every product quantity, every deadline — personalized for your lawn.
      </p>

      <button
        onClick={() => router.push("/plan")}
        className="mt-8 rounded-xl bg-orange px-8 py-4 font-display text-xl text-white uppercase tracking-wider hover:bg-orange/90 transition-colors"
      >
        See My Full Plan →
      </button>

      <p className="font-mono text-[10px] text-muted mt-4">
        Lifetime access · No subscription · No renewals
      </p>
    </div>
  );
}

export default function PurchaseSuccessPage() {
  return (
    <>
      <Nav userState="paid" />
      <main className="mx-auto max-w-md px-4">
        <Suspense>
          <SuccessContent />
        </Suspense>
      </main>
    </>
  );
}
