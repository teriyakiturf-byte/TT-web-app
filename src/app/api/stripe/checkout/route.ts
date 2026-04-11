import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia",
  });
}

export async function POST(req: NextRequest) {
  try {
    const authSession = await getServerSession(authOptions);
    if (!authSession) {
      return NextResponse.json(
        { error: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "STRIPE_NOT_CONFIGURED" },
        { status: 503 }
      );
    }

    const stripe = getStripe();

    const body = await req.json();
    const { email, lawnSqft } = body;

    const baseUrl = process.env.NEXTAUTH_URL || "https://teriyakiturf.com";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Teriyaki Turf — KC Lawn Plan",
              description:
                "Full-year personalized lawn care plan. " +
                "Zone 6a timing. KC clay soil. Johnson County " +
                "blackout law built in. Lifetime access.",
            },
            unit_amount: 6700, // $67.00 in cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        productType: "lawn_plan_lifetime",
        lawnSqft: lawnSqft ? String(lawnSqft) : "",
      },
      success_url: `${baseUrl}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/plan`,
      ...(email ? { customer_email: email } : {}),
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
