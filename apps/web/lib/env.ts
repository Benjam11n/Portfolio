import { keys as security } from "@repo/security/keys";
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  extends: [security()],
  server: {
    RESEND_API_KEY: z.string().min(1),
    FROM_EMAIL: z.string().email(),
    TO_EMAIL: z.string().email(),
    SITE_URL: z.string().url().optional(),
    GOOGLE_SITE_VERIFICATION: z.string().optional(),
    RECAPTCHA_SECRET_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().min(1),
  },
  runtimeEnv: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    FROM_EMAIL: process.env.FROM_EMAIL,
    TO_EMAIL: process.env.TO_EMAIL,
    SITE_URL: process.env.SITE_URL,
    GOOGLE_SITE_VERIFICATION: process.env.GOOGLE_SITE_VERIFICATION,
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
