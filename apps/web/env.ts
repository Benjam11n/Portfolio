import { keys as security } from "@repo/security/keys";
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  extends: [security()],
  server: {
    RESEND_API_KEY: z.string().min(1).default("dummy_key"),
    FROM_EMAIL: z.string().email().default("onboarding@resend.dev"),
    TO_EMAIL: z.string().email().default("ben.wang9000@example.com"),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  },
  runtimeEnv: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    FROM_EMAIL: process.env.FROM_EMAIL,
    TO_EMAIL: process.env.TO_EMAIL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
