import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: DefaultSession["user"] & {
      id: unknown;
      groups: unknown;
      username: unknown;
    };
    accessToken?: string;
    refreshToken?: string;
  }

  interface User {
    access: string;
    refresh: string & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id_token?: string;
    provider?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "@tanstack/react-table" {
  interface ColumnDefBase {
    setFocusedReimbursementId?: number;
    openDrawer?: unknown;
  }
}
