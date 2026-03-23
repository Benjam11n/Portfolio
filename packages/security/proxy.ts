import { createMiddleware, defaults, withVercelToolbar } from "@nosecone/next";
import type { Options } from "@nosecone/next";

export const securityMiddleware = createMiddleware;

export const noseconeOptions: Options = {
  ...defaults,
  contentSecurityPolicy: false,
};

export const noseconeOptionsWithToolbar: Options =
  withVercelToolbar(noseconeOptions);
