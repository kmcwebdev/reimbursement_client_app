import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  skipValidation:
    !!process.env.SKIP_ENV_VALIDATION &&
    process.env.SKIP_ENV_VALIDATION !== "false" &&
    process.env.SKIP_ENV_VALIDATION !== "0",
  isServer: typeof window === "undefined",
  server: {
    PUSHER_APP_ID: z.string().min(1),
    PUSHER_APP_KEY: z.string().min(1),
    PUSHER_APP_SECRET: z.string().min(1),
    PUSHER_APP_CLUSTER: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    PROPELAUTH_API_KEY: z.string().min(1),
    PROPELAUTH_VERIFIER_KEY: z.string().min(1),
    PROPELAUTH_REDIRECT_URI: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_ENVIRONMENT: z.enum(["development", "production"]),
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_BASEAPI_URL: z.string().url(),
    NEXT_PUBLIC_AUTH_URL: z.string().url(),
    NEXT_PUBLIC_PUSHER_APP_KEY: z.string().min(1),
  },
  runtimeEnv: {
    PUSHER_APP_ID: process.env.PUSHER_APP_ID,
    PUSHER_APP_KEY: process.env.PUSHER_APP_KEY,
    PUSHER_APP_SECRET: process.env.PUSHER_APP_SECRET,
    PUSHER_APP_CLUSTER: process.env.PUSHER_APP_CLUSTER,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    PROPELAUTH_API_KEY: process.env.PROPELAUTH_API_KEY,
    PROPELAUTH_VERIFIER_KEY: process.env.PROPELAUTH_VERIFIER_KEY,
    PROPELAUTH_REDIRECT_URI: process.env.PROPELAUTH_REDIRECT_URI,
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_BASEAPI_URL: process.env.NEXT_PUBLIC_BASEAPI_URL,
    NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
    NEXT_PUBLIC_PUSHER_APP_KEY: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
  },
});
