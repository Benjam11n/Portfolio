import react from "@vitejs/plugin-react";
import { defineConfig, type UserConfig } from "vitest/config";

// Helper to create valid config
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

// biome-ignore lint/performance/noBarrelFile: intentional re-export for shared config
export { defineConfig } from "vitest/config";
