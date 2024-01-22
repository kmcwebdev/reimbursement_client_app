/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: unknown;
      groups: unknown;
      username: unknown;
      access_token: any & DefaultSession["user"];
    };
    accessToken?: string;
    refreshToken?: string;
  }

  interface User {
    access: any & DefaultSession["user"];
    refresh: any & DefaultSession["user"];
  }
}

interface JWT {
  id_token?: string;
  provider?: string;
  accessToken?: string;
  refreshToken?: string;
}

declare module "@tanstack/react-table" {
  interface ColumnDefBase {
    setFocusedReimbursementId?: any;
    openDrawer?: any;
  }
}
