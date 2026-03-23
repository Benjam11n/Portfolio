import react from "@vitejs/plugin-react";
import type { UserConfig as ViteUserConfig } from "vite";
import { defineConfig } from "vitest/config";
import type { InlineConfig } from "vitest/node";

type UserConfig = ViteUserConfig & { test?: InlineConfig };

export const createVitestConfig = (options: UserConfig = {}) =>
  defineConfig({
    plugins: [react()],
    ...options,
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: [],
      ...options.test,
    },
  });
