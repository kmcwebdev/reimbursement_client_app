import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  skipValidation:
    !!process.env.SKIP_ENV_VALIDATION &&
    process.env.SKIP_ENV_VALIDATION !== "false" &&
    process.env.SKIP_ENV_VALIDATION !== "0",
  isServer: typeof window === "undefined",
  server: {
    PROPELAUTH_URL: z.string().min(1),
    PROPELAUTH_API_KEY: z.string().min(1),
    PROPELAUTH_VERIFIER_KEY: z.string().min(1),
    PROPELAUTH_KMC_SOLUTIONS_ORG_ID: z.string().min(1),
    PROPELAUTH_KMC_COMMUNITY_ORG_ID: z.string().min(1),
    PUSHER_APP_ID: z.string().min(1),
    PUSHER_APP_KEY: z.string().min(1),
    PUSHER_APP_SECRET: z.string().min(1),
    PUSHER_APP_CLUSTER: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_ENVIRONMENT: z.enum(["development", "production"]),
    NEXT_PUBLIC_PROPELAUTH_URL: z.string().url(),
  },
  runtimeEnv: {
    PROPELAUTH_URL: process.env.PROPELAUTH_URL,
    PROPELAUTH_API_KEY: process.env.PROPELAUTH_API_KEY,
    PROPELAUTH_VERIFIER_KEY: process.env.PROPELAUTH_VERIFIER_KEY,
    PROPELAUTH_KMC_SOLUTIONS_ORG_ID:
      process.env.PROPELAUTH_KMC_SOLUTIONS_ORG_ID,
    PROPELAUTH_KMC_COMMUNITY_ORG_ID:
      process.env.PROPELAUTH_KMC_COMMUNITY_ORG_ID,
    PUSHER_APP_ID: process.env.PUSHER_APP_ID,
    PUSHER_APP_KEY: process.env.PUSHER_APP_KEY,
    PUSHER_APP_SECRET: process.env.PUSHER_APP_SECRET,
    PUSHER_APP_CLUSTER: process.env.PUSHER_APP_CLUSTER,
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
    NEXT_PUBLIC_PROPELAUTH_URL: process.env.NEXT_PUBLIC_PROPELAUTH_URL,
  },
});
