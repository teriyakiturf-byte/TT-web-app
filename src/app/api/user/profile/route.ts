import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Canonical grass-type values accepted from the client (see src/types GrassType).
const GRASS_TYPES = new Set([
  "tall-fescue",
  "kentucky-bluegrass",
  "zoysia",
  "buffalo-grass",
  "mixed-unsure",
]);

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as any).id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { zip, grassType, lawnSqft } = body ?? {};

    const data: Record<string, unknown> = {};

    // zip: optional 5-digit string, or empty to clear.
    if (zip !== undefined) {
      if (zip === "" || zip === null) {
        data.zip = null;
      } else if (typeof zip === "string" && /^\d{5}$/.test(zip)) {
        data.zip = zip;
      } else {
        return NextResponse.json({ error: "INVALID_ZIP" }, { status: 400 });
      }
    }

    // grassType: optional enum, or empty to clear.
    if (grassType !== undefined) {
      if (grassType === "" || grassType === null) {
        data.grassType = null;
      } else if (typeof grassType === "string" && GRASS_TYPES.has(grassType)) {
        data.grassType = grassType;
      } else {
        return NextResponse.json(
          { error: "INVALID_GRASS_TYPE" },
          { status: 400 }
        );
      }
    }

    // lawnSqft: optional integer in a sane range, or empty to clear.
    if (lawnSqft !== undefined) {
      if (lawnSqft === "" || lawnSqft === null) {
        data.lawnSqft = null;
      } else {
        const n = Number(lawnSqft);
        if (!Number.isFinite(n) || n < 100 || n > 100000) {
          return NextResponse.json(
            { error: "INVALID_LAWN_SQFT" },
            { status: 400 }
          );
        }
        data.lawnSqft = Math.round(n);
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "NO_FIELDS" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: (session.user as any).id },
      data,
      select: { id: true, zip: true, grassType: true, lawnSqft: true },
    });

    return NextResponse.json({ user });
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json({ error: "UPDATE_FAILED" }, { status: 500 });
  }
}
