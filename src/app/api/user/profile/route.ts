import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as any).id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const { zip, grassType, lawnSqft } = await req.json();

    const data: Record<string, unknown> = {};
    if (zip !== undefined) data.zip = zip || null;
    if (grassType !== undefined) data.grassType = grassType || null;
    if (lawnSqft !== undefined) data.lawnSqft = lawnSqft ? Number(lawnSqft) : null;

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
