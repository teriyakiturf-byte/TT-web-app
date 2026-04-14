import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncEmailToKit } from "@/lib/kit";

export async function POST(req: NextRequest) {
  try {
    const { email, password, zipCode, lawnSqft, entryPoint } =
      await req.json();

    // 1. Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "INVALID_EMAIL" },
        { status: 400 }
      );
    }

    // 2. Validate password
    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "PASSWORD_TOO_SHORT" },
        { status: 400 }
      );
    }

    // 3. Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });
    if (existing) {
      return NextResponse.json(
        { error: "EMAIL_EXISTS" },
        { status: 409 }
      );
    }

    // 4. Hash password (bcryptjs — NOT bcrypt native module)
    const passwordHash = await bcrypt.hash(password, 12);

    console.log("Signup: creating user in DB for", email);

    // 5. Create user in database
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        zip: zipCode || null,
        lawnSqft: lawnSqft ? Number(lawnSqft) : null,
      },
    });

    console.log("Signup: user created", user.id, user.email);

    // 6. Sync to Kit (wrapped in try/catch — Kit failure does NOT block signup)
    try {
      await syncEmailToKit(email, entryPoint || "direct", {
        zipCode,
        lawnSqft,
      });
    } catch {
      console.warn("Kit sync failed for", email);
    }

    // 7. Return user (without password hash)
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        zip: user.zip,
        lawnSqft: user.lawnSqft,
      },
    });
  } catch (err) {
    console.error("Signup error:", err instanceof Error ? err.message : err);
    console.error("Signup error stack:", err instanceof Error ? err.stack : "no stack");
    return NextResponse.json(
      { error: "SIGNUP_FAILED" },
      { status: 500 }
    );
  }
}
