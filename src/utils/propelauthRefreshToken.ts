import { env } from "~/env.mjs";

interface PropelAuthRefreshTokenResponse {
  access_token: string;
}

const REFRESH_TOKEN_URL = `${env.NEXT_PUBLIC_AUTH_URL}/api/v1/refresh_token`;

export async function propelauthRefreshToken(): Promise<PropelAuthRefreshTokenResponse> {
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

    const refreshToken = data as PropelAuthRefreshTokenResponse;

    return refreshToken;
  } catch (_error: unknown) {
    throw new Error("Failed to refresh token");
  }
}
