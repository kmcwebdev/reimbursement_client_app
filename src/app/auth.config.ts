/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
    async session(params) {
      if (params.session && params.token) {
        params.session.accessToken = params.token.accessToken as string;
        params.session.refreshToken = params.token.refreshToken as string;
      }
      return params.session;
    },
  },
} satisfies NextAuthConfig;
