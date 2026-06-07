import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia",
  });
}

export async function GET(req: NextRequest) {
  try {
    // Require an authenticated user — this endpoint must not be callable
    // anonymously, as it exposes the payment status / details of a session.
    const authSession = await getServerSession(authOptions);
    const userId = (authSession?.user as any)?.id as string | undefined;
    if (!userId) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const sessionId = req.nextUrl.searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "MISSING_SESSION_ID" },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "STRIPE_NOT_CONFIGURED" },
        { status: 503 }
      );
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Enforce ownership: the checkout route stamps the buyer's id into
    // metadata.userId, so only that user may read this session's status.
    if (session.metadata?.userId !== userId) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    // Return only the boolean status — never echo PII (email) back to the
    // client. The success page only consumes `paid`.
    return NextResponse.json({
      paid: session.payment_status === "paid",
    });
  } catch (err) {
    console.error("Stripe verify error:", err);
    return NextResponse.json(
      { error: "VERIFY_FAILED" },
      { status: 500 }
    );
  }
}
