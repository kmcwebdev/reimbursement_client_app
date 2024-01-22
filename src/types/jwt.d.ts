declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id_token?: string;
    provider?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}
