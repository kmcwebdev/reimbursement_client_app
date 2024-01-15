import NextAuth from "next-auth";
import AzureAdProvider from "next-auth/providers/azure-ad";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "../../env.mjs";

import { authConfig } from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  session: {
    strategy: "jwt",
  },
  ...authConfig,
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
      clientId: `${env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID}`,
      clientSecret: `${env.NEXT_PUBLIC_AZURE_AD_CLIENT_SECRET}`,
      tenantId: `${env.NEXT_PUBLIC_AZURE_AD_TENANT_ID}`,
      authorization: {
        params: { scope: "openid email profile User.Read  offline_access" },
      },
    }),
  ],
});
