/* eslint-disable @typescript-eslint/require-await */

import { type NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  providers: [],
  pages: {
    signIn: "login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.access;
        token.refreshToken = user.refresh;
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
