import { keys as security } from "@repo/security/keys";
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  },
  extends: [security()],
  runtimeEnv: {
    FROM_EMAIL: process.env.FROM_EMAIL,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    TO_EMAIL: process.env.TO_EMAIL,
  },
  server: {
    FROM_EMAIL: z.string().email(),
    RESEND_API_KEY: z.string().min(1),
    TO_EMAIL: z.string().email(),
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
