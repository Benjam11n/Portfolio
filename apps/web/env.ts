import { keys as security } from "@repo/security/keys";
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  extends: [security()],
  server: {
    RESEND_API_KEY: z.string().min(1),
    FROM_EMAIL: z.string().email(),
    TO_EMAIL: z.string().email(),
  },
  runtimeEnv: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    FROM_EMAIL: process.env.FROM_EMAIL,
    TO_EMAIL: process.env.TO_EMAIL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
