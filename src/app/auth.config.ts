/* eslint-disable @typescript-eslint/require-await */
import { type JWT } from "@auth/core/jwt";
import type { NextAuthConfig, Session } from "next-auth";
import AzureAdProvider from "next-auth/providers/azure-ad";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "../../env.mjs";

export default {
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (credentials) {
          const authResponse = await fetch(
            `${env.NEXT_PUBLIC_BASEAPI_URL}/token`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(credentials),
            },
          );

          if (!authResponse.ok) {
            return null;
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const user = await authResponse.json();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return user;
        }

        return null;
      },
    }),
    AzureAdProvider({
      clientId: `${env.AZURE_AD_CLIENT_ID}`,
      clientSecret: `${env.AZURE_AD_CLIENT_SECRET}`,
      tenantId: `${env.AZURE_AD_TENANT_ID}`,
      authorization: {
        params: { scope: "openid email profile User.Read  offline_access" },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (token && user) {
        token.accessToken = user.access;
        token.refreshToken = user.refresh;
      }
      return token;
    },
    async session(params) {
      const transformedParams = params as { session: Session; token: JWT };

      const session = transformedParams.session;
      if (transformedParams.session && transformedParams.token) {
        session.accessToken = transformedParams.token.accessToken;
        session.refreshToken = transformedParams.token.refreshToken;
      }

      return session;
    },
  },
} satisfies NextAuthConfig;
