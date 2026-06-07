import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncEmailToKit } from "@/lib/kit";

export async function POST(req: NextRequest) {
  try {
    const { email, password, zipCode, lawnSqft, entryPoint } =
      await req.json();

    // 1. Validate email (format + RFC max length to prevent oversized payloads)
    if (
      typeof email !== "string" ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "INVALID_EMAIL" },
        { status: 400 }
      );
    }

    // 2. Validate password (min length + upper bound — bcrypt only uses the
    //    first 72 bytes, and an unbounded body is a resource-abuse vector)
    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "PASSWORD_TOO_SHORT" },
        { status: 400 }
      );
    }
    if (password.length > 200) {
      return NextResponse.json(
        { error: "PASSWORD_TOO_LONG" },
        { status: 400 }
      );
    }

    // 3. Validate optional profile fields rather than trusting them.
    if (
      zipCode !== undefined &&
      zipCode !== null &&
      zipCode !== "" &&
      !(typeof zipCode === "string" && /^\d{5}$/.test(zipCode))
    ) {
      return NextResponse.json({ error: "INVALID_ZIP" }, { status: 400 });
    }

    let parsedSqft: number | null = null;
    if (lawnSqft !== undefined && lawnSqft !== null && lawnSqft !== "") {
      const n = Number(lawnSqft);
      if (!Number.isFinite(n) || n < 100 || n > 100000) {
        return NextResponse.json(
          { error: "INVALID_LAWN_SQFT" },
          { status: 400 }
        );
      }
      parsedSqft = Math.round(n);
    }

    const safeEntryPoint =
      typeof entryPoint === "string" ? entryPoint.slice(0, 64) : "direct";

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

    // 5. Create user in database
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        zip: zipCode || null,
        lawnSqft: parsedSqft,
      },
    });

    // 6. Sync to Kit (wrapped in try/catch — Kit failure does NOT block signup)
    try {
      await syncEmailToKit(email, safeEntryPoint, {
        zipCode: zipCode || undefined,
        lawnSqft: parsedSqft ?? undefined,
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
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "SIGNUP_FAILED" },
      { status: 500 }
    );
  }
}
