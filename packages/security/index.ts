import arcjet, {
  detectBot,
  request,
  shield,
  slidingWindow,
} from "@arcjet/next";
import type { ArcjetBotCategory, ArcjetWellKnownBot } from "@arcjet/next";
import { logger } from "@repo/logger";

import { keys } from "./keys";

const arcjetKey = keys().ARCJET_KEY;

export const secure = async (
  allow: (ArcjetWellKnownBot | ArcjetBotCategory)[],
  sourceRequest?: Request
) => {
  if (!arcjetKey) {
    return;
  }

  const base = arcjet({
    characteristics: ["ip.src"],
    key: arcjetKey,
    rules: [
      shield({ mode: "LIVE" }),
      slidingWindow({
        interval: "1h",
        max: 50,
        mode: "LIVE",
      }),
    ],
  });

  const req = sourceRequest ?? (await request());

  const aj = base.withRule(detectBot({ allow, mode: "LIVE" }));
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    logger.warn(`Arcjet denied request: ${decision.reason.type}`);

    if (decision.reason.isBot()) {
      throw new Error("Potential bot detected.");
    }

    if (decision.reason.isRateLimit()) {
      throw new Error(
        "You are sending too many requests. Please try again later."
      );
    }

    throw new Error("Suspicious activity detected.");
  }
};
