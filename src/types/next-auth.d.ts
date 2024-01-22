/* eslint-disable @typescript-eslint/no-explicit-any */
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
      accessToken?: string;
      refreshToken?: string;
    };
    accessToken?: string;
    refreshToken?: string;
  }

  interface User {
    access: string;
    refresh: string & DefaultSession["user"];
  }
}

declare module "@tanstack/react-table" {
  interface ColumnDefBase {
    setFocusedReimbursementId?: any;
    openDrawer?: any;
  }
}
