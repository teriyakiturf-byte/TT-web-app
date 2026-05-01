export const dynamic = "force-dynamic";

export async function GET() {
  const { NextResponse } = await import("next/server");

  return NextResponse.json({
    secretKeySet: !!process.env.STRIPE_SECRET_KEY,
    secretKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 7) ?? "NOT SET",
    webhookSecretSet: !!process.env.STRIPE_WEBHOOK_SECRET,
    publishableKeySet: !!process.env.STRIPE_PUBLISHABLE_KEY,
    publishableKeyPrefix: process.env.STRIPE_PUBLISHABLE_KEY?.substring(0, 7) ?? "NOT SET",
  });
}
