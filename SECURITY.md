# Security Operations Checklist — Teriyaki Turf

Code-level controls live in the app. The items below are **infrastructure/console
settings** that the codebase cannot enforce on its own and MUST be verified
before any public launch.

## 1. Database public-API exposure — RLS APPLIED ✅ (verify Data API toggle)

This app talks to Postgres **only through Prisma** using a privileged connection
role (`DATABASE_URL` / `DIRECT_URL`). It does **not** use the Supabase client
libraries or the auto-generated PostgREST/GraphQL Data API.

**Status:** Row Level Security has been **enabled on all six tables** (`User`,
`Account`, `Session`, `VerificationToken`, `Purchase`, `PasswordResetToken`) via
the `enable_rls_on_all_public_tables` migration. With RLS on and no policies, the
public `anon`/`authenticated` API roles are default-denied, while Prisma's
privileged role (which bypasses RLS) continues to work unchanged. Supabase's
security advisor no longer reports the critical `rls_disabled` exposure.

**Recommended belt-and-suspenders (one dashboard click):** the tables are now
unreadable via the public key, but their *names/shape* are still discoverable in
the GraphQL schema (advisor WARN `pg_graphql_*_table_exposed`). To remove that
too, **disable the Data API**: Supabase Dashboard → Project Settings → API →
turn off the Data API. The app is unaffected (Prisma connects directly to
Postgres). This makes the public API moot entirely.

> Note: RLS was applied directly to the live database. If the database is ever
> recreated from scratch, re-run the `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`
> statements (or disable the Data API) before any real user data lands.

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
