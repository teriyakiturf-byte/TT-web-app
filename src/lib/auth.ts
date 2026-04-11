import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
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
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Replace with your actual DB query:
        // const user = await db.user.findUnique({
        //   where: { email: credentials.email }
        // })
        // if (!user) return null
        // const valid = await bcrypt.compare(
        //   credentials.password,
        //   user.password_hash
        // )
        // if (!valid) return null
        // return user

        return null; // placeholder until DB connected
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.plan_purchased = (user as any).plan_purchased;
        token.lawn_sqft = (user as any).lawn_sqft;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).plan_purchased =
          token.plan_purchased as boolean;
        (session.user as any).lawn_sqft =
          token.lawn_sqft as number | null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/plan",
    error: "/plan",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
