import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp, tooManyRequests } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    // Limit token-submission attempts per IP (10 / 15 min) to slow guessing.
    const limit = rateLimit(
      `reset:${getClientIp(req.headers)}`,
      10,
      15 * 60_000
    );
    if (!limit.success) return tooManyRequests(limit.retryAfterSec);

    const { token, password } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "MISSING_TOKEN" },
        { status: 400 }
      );
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "PASSWORD_TOO_SHORT" },
        { status: 400 }
      );
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: "INVALID_TOKEN" },
        { status: 400 }
      );
    }

    if (resetToken.used) {
      return NextResponse.json(
        { error: "TOKEN_USED" },
        { status: 400 }
      );
    }

    if (new Date() > resetToken.expiresAt) {
      return NextResponse.json(
        { error: "TOKEN_EXPIRED" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Update password and mark token as used in a transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { email: resetToken.email },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ]);

    return NextResponse.json({ reset: true });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json(
      { error: "RESET_FAILED" },
      { status: 500 }
    );
  }
}
