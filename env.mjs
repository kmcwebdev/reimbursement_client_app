import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  skipValidation:
    !!process.env.SKIP_ENV_VALIDATION &&
    process.env.SKIP_ENV_VALIDATION !== "false" &&
    process.env.SKIP_ENV_VALIDATION !== "0",
  isServer: typeof window === "undefined",
  server: {
    NODE_ENV: z.enum(["development", "production"]),
    PUSHER_APP_ID: z.string().min(1),
    PUSHER_APP_KEY: z.string().min(1),
    PUSHER_APP_SECRET: z.string().min(1),
    PUSHER_APP_CLUSTER: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    NEXT_AUTH_SECRET: z.string().min(1),
    AZURE_AD_CLIENT_ID: z.string().min(1),
    AZURE_AD_TENANT_ID: z.string().min(1),
    AZURE_AD_CLIENT_SECRET: z.string().min(1),
    AUTH_SECRET: z.string().min(1)
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_ENVIRONMENT: z.enum(["development", "production"]),
    NEXT_PUBLIC_PUSHER_APP_KEY: z.string().min(1),
    NEXT_PUBLIC_BASEAPI_URL: z.string().url(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    PUSHER_APP_ID: process.env.PUSHER_APP_ID,
    PUSHER_APP_KEY: process.env.PUSHER_APP_KEY,
    PUSHER_APP_SECRET: process.env.PUSHER_APP_SECRET,
    PUSHER_APP_CLUSTER: process.env.PUSHER_APP_CLUSTER,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_AUTH_SECRET: process.env.NEXT_AUTH_SECRET,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AZURE_AD_CLIENT_ID: process.env.AZURE_AD_CLIENT_ID,
    AZURE_AD_TENANT_ID: process.env.AZURE_AD_TENANT_ID,
    AZURE_AD_CLIENT_SECRET: process.env.AZURE_AD_CLIENT_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
    NEXT_PUBLIC_PUSHER_APP_KEY: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
    NEXT_PUBLIC_BASEAPI_URL: process.env.NEXT_PUBLIC_BASEAPI_URL,
  },
});
