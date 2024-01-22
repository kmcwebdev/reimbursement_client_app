/* eslint-disable @typescript-eslint/require-await */

import { type JWT } from "@auth/core/jwt";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import { type Session } from "next-auth/types";

export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
  },
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
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session && token) {
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken as string;
      }
      return session as DefaultSession;
    },
  },
} satisfies NextAuthConfig;
