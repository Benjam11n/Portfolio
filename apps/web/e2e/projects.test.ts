import { expect, test } from "@playwright/test";

import { projectSlugs, waitForPageReady } from "./fixtures";

// Regex patterns at top level
const TITLE_REGEX = /Portfolio/;
const PROJECTS_URL_REGEX = /projects/;

test.describe("Project Pages", () => {
  test.setTimeout(60_000);

  test("project navigation flow works", async ({ page }) => {
    // Go to home and click on a project
    await page.goto("/");
    await expect(page).toHaveTitle(TITLE_REGEX);

    const projectsSection = page.locator("#projects");
    await projectsSection.scrollIntoViewIfNeeded();

    const firstProjectCard = page.locator("a[href^='/projects/']").first();
    await firstProjectCard.waitFor({ state: "visible", timeout: 10_000 });
    await firstProjectCard.click({ force: true });

    // Verify project page loads
    await expect(page).toHaveURL(PROJECTS_URL_REGEX);
    const heading = page.locator("h1");
    await expect(heading).toBeVisible({ timeout: 15_000 });

    // Verify JSON-LD
    const jsonLdScript = page.locator('script[type="application/ld+json"]');
    await expect(jsonLdScript).toBeAttached();
  });

  // Test all 6 projects
  for (const slug of projectSlugs) {
    test(`${slug} loads correctly`, async ({ page }) => {
      await page.goto(`/projects/${slug}`);
      await waitForPageReady(page);
      await expect(page.locator("h1")).toBeVisible({ timeout: 15_000 });
    });
  }
});
