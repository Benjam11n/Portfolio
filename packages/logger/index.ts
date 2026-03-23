import pino from "pino";
import type { Logger } from "pino";

export const logger: Logger =
  process.env.NODE_ENV === "development"
    ? pino({
        transport: {
          options: {
            colorize: true,
          },
          target: "pino-pretty",
        },
      })
    : pino();
