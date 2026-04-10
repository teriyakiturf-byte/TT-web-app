import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia",
  });
}

export async function GET(req: NextRequest) {
  try {
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

    return NextResponse.json({
      paid: session.payment_status === "paid",
      email: session.customer_email || session.customer_details?.email || null,
    });
  } catch (err) {
    console.error("Stripe verify error:", err);
    return NextResponse.json(
      { error: "VERIFY_FAILED" },
      { status: 500 }
    );
  }
}
