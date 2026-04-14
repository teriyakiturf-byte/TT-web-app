import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia",
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: "WEBHOOK_NOT_CONFIGURED" },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "INVALID_SIGNATURE" },
        { status: 400 }
      );
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.payment_status === "paid") {
        const email =
          session.customer_email || session.customer_details?.email;
        const metadata = session.metadata;

        console.log("Payment successful:", {
          email,
          userId: metadata?.userId,
          productType: metadata?.productType,
          lawnSqft: metadata?.lawnSqft,
          sessionId: session.id,
        });

        // Find user: prefer metadata.userId, fall back to email lookup
        let user = metadata?.userId
          ? await prisma.user.findUnique({ where: { id: metadata.userId } })
          : null;

        if (!user && email) {
          user = await prisma.user.findUnique({ where: { email } });
        }

        if (user) {
          // Create purchase record + mark user as paid in one transaction
          await prisma.$transaction([
            prisma.purchase.create({
              data: {
                userId: user.id,
                stripeSessionId: session.id,
                stripePaymentIntent:
                  typeof session.payment_intent === "string"
                    ? session.payment_intent
                    : null,
                amount: session.amount_total ?? 4700,
                productType: metadata?.productType ?? "lawn_plan_annual",
                lawnSqft: metadata?.lawnSqft
                  ? Number(metadata.lawnSqft)
                  : null,
              },
            }),
            prisma.user.update({
              where: { id: user.id },
              data: {
                planPurchased: true,
                purchasedAt: new Date(),
              },
            }),
          ]);

          console.log("User marked as paid:", user.id);
        } else {
          // User paid but no account yet — log for manual resolution
          console.warn(
            "Payment received but no user found:",
            { email, userId: metadata?.userId, sessionId: session.id }
          );
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: "WEBHOOK_FAILED" },
      { status: 500 }
    );
  }
}
