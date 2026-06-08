/**
 * Lightweight in-process rate limiter (fixed window).
 *
 * Zero-dependency and zero-config: state lives in a module-level Map, so it
 * needs no Redis/Upstash account or env vars. This fully protects a
 * single-instance deployment.
 *
 * Caveat for serverless / multi-instance hosting (e.g. Vercel): each running
 * instance keeps its own counters and cold starts reset them, so the effective
 * limit is per-instance rather than global. It still meaningfully raises the
 * bar against naive brute-force/abuse. When you outgrow this, swap the body of
 * `rateLimit()` for a shared store (e.g. @upstash/ratelimit + @upstash/redis)
 * — the call sites and return shape can stay the same.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Opportunistic cleanup so the Map can't grow without bound under attack.
let lastSweep = 0;
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, b] of buckets) {
    if (b.resetAt <= now) buckets.delete(key);
  }
}

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  retryAfterSec: number;
};

/**
 * Records one hit against `key` and reports whether it is within `limit` per
 * `windowMs`. Returns retryAfterSec (seconds until the window resets) when blocked.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, retryAfterSec: 0 };
  }

  existing.count += 1;
  if (existing.count > limit) {
    return {
      success: false,
      remaining: 0,
      retryAfterSec: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  return {
    success: true,
    remaining: limit - existing.count,
    retryAfterSec: 0,
  };
}

/**
 * Best-effort client IP from common proxy headers. Accepts anything with a
 * header getter (NextRequest.headers, or a next-auth `req.headers` object).
 * Falls back to "unknown" so a missing IP shares one (heavily limited) bucket
 * rather than bypassing the limiter.
 */
export function getClientIp(
  headers:
    | Headers
    | { get?: (k: string) => string | null | undefined }
    | Record<string, string | string[] | undefined>
    | undefined
): string {
  const read = (name: string): string | undefined => {
    if (!headers) return undefined;
    if (typeof (headers as Headers).get === "function") {
      return (headers as Headers).get(name) ?? undefined;
    }
    const v = (headers as Record<string, string | string[] | undefined>)[name];
    return Array.isArray(v) ? v[0] : v;
  };

  const fwd = read("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return read("x-real-ip") || "unknown";
}

/** Standard 429 JSON response with a Retry-After header. */
export function tooManyRequests(retryAfterSec: number): Response {
  return new Response(
    JSON.stringify({ error: "RATE_LIMITED", retryAfterSec }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(Math.max(1, retryAfterSec)),
      },
    }
  );
}
