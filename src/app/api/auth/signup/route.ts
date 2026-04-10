import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
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

    // 3. Hash password (bcryptjs — NOT bcrypt native module)
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Create user record
    // TODO: Replace with real database (Supabase, Prisma, etc.)
    // For now, generate a stub user ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Store user data — stub implementation
    // In production: INSERT INTO users (id, email, password_hash, zip, sqft, ...)
    const user = {
      id: userId,
      email,
      passwordHash: hashedPassword,
      zipCode: zipCode || null,
      lawnSqft: lawnSqft || null,
      planPurchased: false,
      createdAt: new Date().toISOString(),
    };

    // 5. Sync to Kit (wrapped in try/catch — Kit failure does NOT block signup)
    await syncEmailToKit(email, entryPoint || "direct", {
      zipCode,
      lawnSqft,
    });

    // 6. Return user (without password hash)
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        zipCode: user.zipCode,
        lawnSqft: user.lawnSqft,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "SIGNUP_FAILED" },
      { status: 500 }
    );
  }
}
