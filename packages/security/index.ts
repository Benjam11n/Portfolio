import arcjet, {
  type ArcjetBotCategory,
  type ArcjetWellKnownBot,
  detectBot,
  request,
  shield,
  slidingWindow,
} from "@arcjet/next";
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
    key: arcjetKey,
    characteristics: ["ip.src"],
    rules: [
      shield({ mode: "LIVE" }),
      slidingWindow({
        mode: "LIVE",
        interval: "1h",
        max: 50,
      }),
    ],
  });

  const req = sourceRequest ?? (await request());

  const aj = base.withRule(detectBot({ mode: "LIVE", allow }));
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
