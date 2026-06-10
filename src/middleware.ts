import { withAuth } from "next-auth/middleware";

/**
 * Server-side access control for paid-only routes.
 *
 * Client components still redirect for UX, but the real enforcement happens
 * here at the edge so the gated routes cannot be reached (or their RSC/data
 * payloads scraped) by guests or free-tier users.
 *
 * `token.planPurchased` is populated by the jwt callback in src/lib/auth.ts.
 */
export default withAuth({
  callbacks: {
    authorized: ({ token }) => token?.planPurchased === true,
  },
  pages: {
    // Unauthorized users are sent to the upsell page rather than a sign-in loop.
    signIn: "/plan",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/checklist/:path*",
    "/milestones/:path*",
    "/calendar/:path*",
  ],
};
