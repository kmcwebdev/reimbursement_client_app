/* eslint-disable @typescript-eslint/require-await */

import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  providers: [],
  pages: {
    signIn: "login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (token && user) {
        token.accessToken = user.access as string;
        token.refreshToken = user.refresh as string;
      }

      return token;
      // return refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (session && token) {
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
