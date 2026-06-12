import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SuccessClient from "./SuccessClient";

/**
 * Server-side access control for the post-purchase success screen.
 *
 * The success page must never be reachable by guests or free-tier users —
 * the URL alone is not a credential. We enforce two gates before rendering:
 *
 *   1. Authentication — no session → /signin
 *   2. Payment        — `planPurchased` is false → /plan (the paywall/upsell)
 *
 * `planPurchased` is the authoritative paid flag, set by the Stripe webhook
 * (src/app/api/stripe/webhook/route.ts) on successful checkout. We read it
 * straight from the DB here rather than trusting the JWT so a fresh purchase
 * (or revocation) is reflected immediately.
 */
export default async function SuccessPage() {
  // Guard 1: must be authenticated
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/signin?reason=auth-required");
  }

  // Guard 2: must be a paid user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, planPurchased: true },
  });

  if (!user) {
    redirect("/signin?reason=user-not-found");
  }

  if (!user.planPurchased) {
    redirect("/plan?reason=payment-required");
  }

  return <SuccessClient />;
}
