/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextAuthConfig } from "next-auth";

// async function refreshAccessToken(token: any) {
//   try {
//     const url = `https://login.microsoftonline.com/${env.NEXT_PUBLIC_AZURE_AD_TENANT_ID}/oauth2/v2.0/token`;

//     const body = new URLSearchParams({
//       client_id:
//         process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID || "azure-ad-client-id",
//       client_secret:
//         process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_SECRET ||
//         "azure-ad-client-secret",
//       scope: "email openid profile User.Read offline_access",
//       grant_type: "refresh_token",
//       refresh_token: token.refreshToken as string,
//     });

//     const response = await fetch(url, {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       method: "POST",
//       body,
//     });

//     const refreshedTokens = await response.json();
//     if (!response.ok) {
//       throw refreshedTokens;
//     }

//     return {
//       ...token,
//       accessToken: refreshedTokens.id_token,
//       accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
//       refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
//     };
//   } catch (error) {
//     return {
//       ...token,
//       error: "RefreshAccessTokenError",
//     };
//   }
// }

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
