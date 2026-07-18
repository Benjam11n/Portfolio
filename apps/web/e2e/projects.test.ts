import { expect, test } from "@playwright/test";

import { projectSlugs, waitForPageReady } from "./fixtures";

test.describe("Project Pages", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "Full project route coverage stays Chromium-only"
  );
  test.setTimeout(60_000);

  for (const slug of projectSlugs) {
    test(`${slug} loads correctly`, async ({ page }) => {
      await page.goto(`/projects/${slug}`);
      await waitForPageReady(page);
      await expect(page.locator("h1")).toBeVisible({ timeout: 15_000 });
    });
  }
});
