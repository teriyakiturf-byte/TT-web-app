import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/prisma";
import { syncEmailToKit } from "@/lib/kit";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        // Throttle login attempts per IP (10 / 10 min) before doing any DB
        // lookup or bcrypt work. On limit we return null (indistinguishable
        // from a bad password) so we don't reveal the throttle to attackers.
        const ip = getClientIp(req?.headers);
        if (!rateLimit(`signin:${ip}`, 10, 10 * 60_000).success) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) return null;

        const valid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        try {
          await syncEmailToKit(user.email, "google-oauth", {});
        } catch {
          // Kit sync failure doesn't block sign-in
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Relative callback URLs are always same-origin and safe.
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Absolute URLs must match the app's origin EXACTLY. A prefix check
      // (url.startsWith(baseUrl)) is bypassable via lookalike domains such as
      // "https://teriyakiturf.com.evil.com", so compare parsed origins instead.
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch {
        // Malformed URL — fall through to the safe default.
      }
      return baseUrl;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
      }

      // On every token refresh, fetch latest plan status from DB
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            planPurchased: true,
            lawnSqft: true,
            grassType: true,
            zip: true,
          },
        });
        if (dbUser) {
          token.planPurchased = dbUser.planPurchased;
          token.lawnSqft = dbUser.lawnSqft;
          token.grassType = dbUser.grassType;
          token.zip = dbUser.zip;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).planPurchased =
          token.planPurchased as boolean;
        (session.user as any).lawnSqft =
          token.lawnSqft as number | null;
        (session.user as any).grassType =
          token.grassType as string | null;
        (session.user as any).zip = token.zip as string | null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
