/* eslint-disable @typescript-eslint/require-await */

import type { Session, NextAuthConfig, User } from "next-auth";
import type { JWT } from 'next-auth/jwt'

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
    async session({ session, token }: { session: Session; token?: JWT; user?: User }) {
      if (session && token) {
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
