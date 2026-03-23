import path from "node:path";

import { createVitestConfig } from "../../packages/testing/vitest.config";

export default createVitestConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./"),
    },
  },
  test: {
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**"],
    setupFiles: ["../../packages/testing/setup.ts"],
  },
});
