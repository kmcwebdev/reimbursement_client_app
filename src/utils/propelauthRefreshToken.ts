import { env } from "~/env.mjs";

type PropelAuthRefreshTokenResponse = {
  access_token: string;
};

const REFRESH_TOKEN_URL = `${env.NEXT_PUBLIC_PROPELAUTH_URL}/api/v1/refresh_token`;

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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data: PropelAuthRefreshTokenResponse = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to refresh token");
  }
}