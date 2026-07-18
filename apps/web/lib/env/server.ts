import { keys as security } from "@repo/security/keys";
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const serverEnv = createEnv({
  extends: [security()],
  runtimeEnv: {
    FROM_EMAIL: process.env.FROM_EMAIL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    TO_EMAIL: process.env.TO_EMAIL,
  },
  server: {
    FROM_EMAIL: z.email(),
    RESEND_API_KEY: z.string().min(1),
    TO_EMAIL: z.email(),
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
