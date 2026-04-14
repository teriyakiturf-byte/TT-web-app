import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Module-level singleton — initialized once, reused across requests
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-03-25.dahlia",
    })
  : null;

export async function POST(req: NextRequest) {
  try {
    const authSession = await getServerSession(authOptions);
    if (!authSession?.user || !(authSession.user as any).id) {
      return NextResponse.json(
        { error: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    if (!stripe) {
      return NextResponse.json(
        { error: "STRIPE_NOT_CONFIGURED" },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { lawnSqft } = body;

    // Use server-verified email — never trust client-sent email for Stripe
    const userEmail = authSession.user.email;
    const userId = (authSession.user as any).id as string;

    const baseUrl = process.env.NEXTAUTH_URL || "https://teriyakiturf.com";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Teriyaki Turf — KC Lawn Plan",
              description:
                "Full-year personalized lawn care plan. " +
                "Zone 6a timing. KC clay soil. Soil temp " +
                "triggers built in.",
            },
            unit_amount: 4700, // $47.00 in cents
            recurring: {
              interval: "year",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        productType: "lawn_plan_annual",
        lawnSqft: lawnSqft ? String(lawnSqft) : "",
      },
      success_url: `${baseUrl}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/plan`,
      // Only pass customer_email if it's a real email string
      // Passing undefined/null/empty locks Stripe's email field
      ...(userEmail && typeof userEmail === "string" && userEmail.includes("@")
        ? { customer_email: userEmail }
        : {}),
      allow_promotion_codes: true,
    });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "CHECKOUT_FAILED" },
      { status: 500 }
    );
  }
}
