import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addTagToKit } from "@/lib/kit";
import { rateLimit, getClientIp, tooManyRequests } from "@/lib/rateLimit";

// Floor the public counter so the card never looks empty pre-launch (per spec:
// if real signups are under 5, display 23).
const DISPLAY_FLOOR = 23;
const FLOOR_THRESHOLD = 5;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// GET — public waitlist count for the dashboard counter.
export async function GET() {
  try {
    const real = await prisma.fertilizerWaitlist.count();
    const count = real < FLOOR_THRESHOLD ? DISPLAY_FLOOR : real;
    return NextResponse.json({ count });
  } catch (err) {
    console.error("fertilizer-waitlist count error:", err);
    return NextResponse.json({ count: DISPLAY_FLOOR });
  }
}

// POST — join the fertilizer waitlist. Paid users only.
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;

  // Paid-only gate (planPurchased is server-verified in the JWT).
  if (!userId || !(session!.user as any).planPurchased) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  // Throttle submissions per IP (5 / 10 min) to curb abuse.
  const ip = getClientIp(req.headers);
  const limit = rateLimit(`fertilizer-waitlist:${ip}`, 5, 10 * 60_000);
  if (!limit.success) return tooManyRequests(limit.retryAfterSec);

  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body?.email ?? "").trim().toLowerCase();

    // 1. Validate email.
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "INVALID_EMAIL" }, { status: 400 });
    }

    // Pull the authoritative zip from the user's record (don't trust client).
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { zip: true },
    });

    // 2. Duplicate check.
    const existing = await prisma.fertilizerWaitlist.findUnique({
      where: { email },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json({ status: "already" });
    }

    // 3. Insert. Guard the unique constraint against a race with catch below.
    await prisma.fertilizerWaitlist.create({
      data: { email, userId, zip: user?.zip ?? null },
    });

    // 4. Tag the subscriber in Kit (best-effort — never blocks success).
    await addTagToKit(email, "fertilizer-waitlist");

    return NextResponse.json({ status: "joined" });
  } catch (err) {
    // Unique-constraint violation → treat as an already-joined duplicate.
    if ((err as { code?: string })?.code === "P2002") {
      return NextResponse.json({ status: "already" });
    }
    console.error("fertilizer-waitlist submit error:", err);
    return NextResponse.json({ error: "SUBMIT_FAILED" }, { status: 500 });
  }
}
