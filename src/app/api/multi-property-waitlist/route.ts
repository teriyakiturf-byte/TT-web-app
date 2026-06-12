import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { syncEmailToKit } from "@/lib/kit";
import { rateLimit, getClientIp, tooManyRequests } from "@/lib/rateLimit";

// Kit tag / entry point recorded for everyone who joins the waitlist.
const KIT_TAG = "multi-property-waitlist";

export async function POST(req: NextRequest) {
  try {
    // Throttle per IP (5 / 10 min) — same budget as account creation.
    const limit = rateLimit(
      `waitlist:${getClientIp(req.headers)}`,
      5,
      10 * 60_000
    );
    if (!limit.success) return tooManyRequests(limit.retryAfterSec);

    const { email } = await req.json();

    // Validate email (format + RFC max length to bound the payload).
    if (
      typeof email !== "string" ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json({ error: "INVALID_EMAIL" }, { status: 400 });
    }

    // Attach the logged-in user when present; null is fine (column is optional).
    const session = await getServerSession(authOptions);
    const userId = ((session?.user as any)?.id as string | undefined) ?? null;

    // Idempotent: a repeat tap from the same email shouldn't pile up rows.
    const existing = await prisma.multiPropertyWaitlist.findFirst({
      where: { email },
      select: { id: true },
    });
    if (!existing) {
      await prisma.multiPropertyWaitlist.create({
        data: { email, userId },
      });
    }

    // Tag in Kit — wrapped so Kit downtime never blocks the waitlist join.
    try {
      await syncEmailToKit(email, KIT_TAG);
    } catch {
      console.warn("Kit tag failed for waitlist signup", email);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Waitlist signup error:", err);
    return NextResponse.json({ error: "WAITLIST_FAILED" }, { status: 500 });
  }
}
