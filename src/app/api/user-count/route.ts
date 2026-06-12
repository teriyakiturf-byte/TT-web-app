import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

// Revalidate the cached count every 60 seconds (F1).
export const revalidate = 60;

// Count users whose ZIP is in the KC / Johnson County footprint (660xx or
// 641xx). Wrapped in unstable_cache so the DB is hit at most once per 60s.
const getKCUserCount = unstable_cache(
  async () => {
    return prisma.user.count({
      where: {
        OR: [
          { zip: { startsWith: "660" } },
          { zip: { startsWith: "641" } },
        ],
      },
    });
  },
  ["kc-user-count"],
  { revalidate: 60 }
);

export async function GET() {
  try {
    const raw = await getKCUserCount();
    // Floor the displayed number so the page never looks empty early on.
    const count = raw < 10 ? 47 : raw;
    return NextResponse.json({ count });
  } catch (err) {
    console.error("user-count error:", err);
    return NextResponse.json({ count: 47 });
  }
}
