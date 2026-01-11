import path from "node:path";
import { createVitestConfig } from "../../packages/testing/vitest.config";

export default createVitestConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  test: {
    setupFiles: ["./test/setup-env.ts"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**"],
  },
});
