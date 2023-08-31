import { env } from "~/env.mjs";

interface UserInfo {
  user_id: string;
  email: string;
  email_confirmed: boolean;
  has_password: boolean;
  username: string;
  first_name: string;
  last_name: string;
  picture_url: string;
  properties: Record<string, unknown>;
  metadata: null;
  locked: boolean;
  enabled: boolean;
  mfa_enabled: boolean;
  can_create_orgs: boolean;
  created_at: number;
  last_active_at: number;
  org_id_to_org_info: Record<
    string,
    {
      org_id: string;
      org_name: string;
      org_metadata: Record<string, unknown>;
      url_safe_org_name: string;
      user_role: string;
      inherited_user_roles_plus_current_role: string[];
      user_permissions: string[];
    }
  >;
  update_password_required: boolean;
}

interface User {
  userinfo: UserInfo;
  accessToken: string;
}

const REFRESH_TOKEN_URL = `${env.NEXT_PUBLIC_APP_URL}/api/auth/userinfo`;

export async function propelauthUserInfo(): Promise<User> {
  try {
    const response = await fetch(REFRESH_TOKEN_URL, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.statusText}`);
    }

    const data = (await response.json()) as unknown;

    const userWithAccessToken = data as User;

    return userWithAccessToken;
  } catch (_error: unknown) {
    throw new Error("Failed to refresh token");
  }
}
