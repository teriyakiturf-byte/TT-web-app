# Security Operations Checklist — Teriyaki Turf

Code-level controls live in the app. The items below are **infrastructure/console
settings** that the codebase cannot enforce on its own and MUST be verified
before any public launch.

## 1. Supabase Data API must be disabled (or RLS enforced) — REQUIRED

This app talks to Postgres **only through Prisma** using a privileged connection
role (`DATABASE_URL` / `DIRECT_URL`). It does **not** use the Supabase client
libraries or the auto-generated PostgREST Data API.

Prisma migrations create tables with **Row Level Security disabled** (Postgres
default), and Supabase exposes the `public` schema to the public `anon` key by
default. If left as-is after migrating, anyone with the publishable anon key
could read `User.passwordHash` and live `PasswordResetToken.token` values —
enabling account takeover.

**Action (choose one):**

- **Recommended:** Supabase Dashboard → Project Settings → API → **disable the
  Data API**. The app keeps working (Prisma connects directly to Postgres).
- **Alternative:** keep the Data API on and enable RLS with default-deny on every
  table (`User`, `Account`, `Session`, `PasswordResetToken`, `Purchase`):
  ```sql
  ALTER TABLE "User"               ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "Account"            ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "Session"            ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "PasswordResetToken" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "Purchase"           ENABLE ROW LEVEL SECURITY;
  ```
  (Prisma's privileged role bypasses RLS, so the app is unaffected; the anon
  role is denied.)

**Verify after migrating:** run Supabase's security advisors and confirm there
are no `rls_disabled_in_public` lints.

## 2. Restrict the Google Maps API key — REQUIRED

`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is necessarily exposed to the browser. Lock it
down in Google Cloud Console so a leaked key can't be abused for quota theft:

- **Application restriction:** HTTP referrers → your production domain(s) only.
- **API restriction:** Maps JavaScript API, Drawing, and Geometry libraries only.

## 3. Production environment variables

- `NEXTAUTH_URL` must be the real production domain (not `localhost`).
- All secrets (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXTAUTH_SECRET`,
  `DATABASE_URL`, `DIRECT_URL`, `RESEND_API_KEY`, `KIT_API_KEY`,
  `GOOGLE_CLIENT_SECRET`) must be set server-side only — never with a
  `NEXT_PUBLIC_` prefix.

## 4. Deferred — Next.js major upgrade (tracked, pre-launch)

`next@14.2.35` is the latest 14.x release; **no in-major patch fixes the open
advisories**. Remediation requires a major upgrade to `15.5.x` (security-backport
line) or `16.2.7` (latest).

Applicability assessment for this app (App Router + `next-auth` middleware,
pre-launch):
- 3 of the 4 "high" audit entries are **dev-tooling only** (`eslint-config-next`,
  `@next/eslint-plugin-next`, `glob`) and do not ship to production.
- `next`'s runtime advisories that apply here are **DoS-class** (RSC request
  deserialization, Image Optimizer, image disk-cache growth) and **middleware
  redirect cache-poisoning**. None are RCE or auth-bypass for this config; the
  CSP-nonce XSS, `beforeInteractive` XSS, and Pages-Router i18n bypass do **not**
  apply (no nonces, no `beforeInteractive`, App Router only).

**Severity: moderate; do before public launch.** Treat as a dedicated, tested
effort: the upgrade has runtime breaking changes (async `cookies()`/`headers()`,
caching defaults) plus `next-auth@4` interplay that must be validated against
live auth flows — not bundled into a quick patch pass.

## 5. Deferred control — rate limiting (tracked, not yet implemented)

The authentication endpoints (`/api/auth/signup`, `/api/auth/forgot-password`,
`/api/auth/reset-password`) and credentials sign-in are not yet rate limited.
Add an IP + identifier limiter (e.g. `@upstash/ratelimit`) before launch to
prevent brute-force, reset-token guessing, and email-bombing.
