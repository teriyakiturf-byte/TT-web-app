import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

// Revalidate the cached count every 60 seconds (F1).
export const revalidate = 60;

// Count users whose ZIP is in the KC / Johnson County footprint (660xx or
// 641xx). Wrapped in unstable_cache so the DB is hit at most once per 60s.
//
// A Supabase outage, a missing table, or an RLS denial must never bubble up to
// the landing page (which would 500 the top of the funnel). The query is
// wrapped in try/catch with a guaranteed numeric fallback so this function
// always resolves to a safe count (B4).
const getKCUserCount = unstable_cache(
  async (): Promise<number> => {
    try {
      const count = await prisma.user.count({
        where: {
          OR: [
            { zip: { startsWith: "660" } },
            { zip: { startsWith: "641" } },
          ],
        },
      });
      // Floor the displayed number so the page never looks empty early on.
      return count < 10 ? 47 : count;
    } catch (error) {
      console.error("[user-count] Supabase query failed:", error);
      return 47; // safe fallback — always show something
    }
  },
  ["kc-user-count"],
  { revalidate: 60 }
);

export async function GET() {
  // Second layer of safety: this endpoint must NEVER return a 500.
  try {
    const count = await getKCUserCount();
    return NextResponse.json({ count });
  } catch (err) {
    console.error("[user-count] handler failed:", err);
    return NextResponse.json({ count: 47 });
  }
}
