/* eslint-disable @typescript-eslint/require-await */
import NextAuth from "next-auth";

import authConfig from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: undefined,
  session: {
    strategy: "jwt",
  },
  ...authConfig,
  trustHost: true,
});
