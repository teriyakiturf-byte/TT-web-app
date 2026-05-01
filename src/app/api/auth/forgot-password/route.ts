import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "INVALID_EMAIL" },
        { status: 400 }
      );
    }

    console.log("[forgot-password] Looking up user:", email);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    console.log("[forgot-password] User found:", !!user, "Has password:", !!user?.passwordHash);

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "EMAIL_NOT_FOUND" },
        { status: 404 }
      );
    }

    console.log("[forgot-password] Invalidating old tokens");

    await prisma.passwordResetToken.updateMany({
      where: { email, used: false },
      data: { used: true },
    });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    console.log("[forgot-password] Creating token:", token.substring(0, 8) + "...");

    await prisma.passwordResetToken.create({
      data: { email, token, expiresAt },
    });

    console.log("[forgot-password] Sending email to:", email);

    await sendPasswordResetEmail(email, token);

    console.log("[forgot-password] Email sent successfully");

    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("[forgot-password] Error:", err);
    return NextResponse.json(
      { error: "SEND_FAILED" },
      { status: 500 }
    );
  }
}
