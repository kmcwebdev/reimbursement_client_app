import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  skipValidation:
    !!process.env.SKIP_ENV_VALIDATION &&
    process.env.SKIP_ENV_VALIDATION !== "false" &&
    process.env.SKIP_ENV_VALIDATION !== "0",
  isServer: typeof window === "undefined",
  server: {
    TEST: z.string().url(),
  },
  client: {
    NEXT_PUBLIC_ENVIRONMENT: z.enum(["development", "test", "production"]),
    NEXT_PUBLIC_PROPELAUTH_URL: z.string().url(),
  },
  runtimeEnv: {
    TEST: process.env.TEST,
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
    NEXT_PUBLIC_PROPELAUTH_URL: process.env.NEXT_PUBLIC_PROPELAUTH_URL,
  },
});
