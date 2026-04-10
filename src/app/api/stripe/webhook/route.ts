import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

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
        const email = session.customer_email || session.customer_details?.email;
        const metadata = session.metadata;

        console.log("Payment successful:", {
          email,
          productType: metadata?.productType,
          lawnSqft: metadata?.lawnSqft,
          sessionId: session.id,
        });

        // TODO: When database is added, update user record here:
        // await db.user.update({
        //   where: { email },
        //   data: { planPurchased: true, stripeSessionId: session.id },
        // });
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
