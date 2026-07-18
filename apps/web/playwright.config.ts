import { tmpdir } from "node:os";
import path from "node:path";

import { defineConfig, devices } from "@playwright/test";

const playwrightArtifactsDir =
  process.env.PLAYWRIGHT_ARTIFACTS_DIR ||
  path.join(tmpdir(), "portfolio-playwright");
const playwrightPort = Number(process.env.PLAYWRIGHT_PORT || 3100);
const playwrightBaseURL = `http://localhost:${playwrightPort}`;

export default defineConfig({
  forbidOnly: !!process.env.CI,
  fullyParallel: true,
  outputDir: path.join(playwrightArtifactsDir, "test-results"),
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  reporter: [
    [
      "html",
      {
        open: "never",
        outputFolder: path.join(playwrightArtifactsDir, "playwright-report"),
      },
    ],
    ["list"],
  ],
  retries: process.env.CI ? 2 : 0,
  testDir: "./e2e",
  timeout: 60_000,
  use: {
    baseURL: playwrightBaseURL,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  webServer: {
    command: `PLAYWRIGHT_TEST=1 PORT=${playwrightPort} pnpm dev`,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    url: playwrightBaseURL,
  },
  workers: process.env.CI ? 2 : undefined,
});
