import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { SignJWT } from "jose";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        const expiresIn = process.env.JWT_EXPIRES_IN ?? "1d";

        token.jwt = await new SignJWT({
          email: user.email,
          name: user.name,
        })
          .setProtectedHeader({ alg: "HS256" })
          .setSubject(user.email)
          .setExpirationTime(expiresIn)
          .sign(secret);
      }

      return token;
    },

    async session({ session, token }) {
      session.user.jwt = token.jwt as string;
      return session;
    },
  },
};
