import os from "node:os";
import path from "node:path";

import { createVitestConfig } from "../../packages/testing/vitest.config";

export default createVitestConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./"),
      "@repo/logger": path.resolve(
        import.meta.dirname,
        "./__mocks__/@repo/logger.ts"
      ),
      "@repo/security": path.resolve(
        import.meta.dirname,
        "./__mocks__/@repo/security.ts"
      ),
    },
  },
  test: {
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**"],
    maxWorkers: Math.min(os.cpus().length, 6),
    pool: "threads",
    setupFiles: ["../../packages/testing/setup.ts"],
  },
});
