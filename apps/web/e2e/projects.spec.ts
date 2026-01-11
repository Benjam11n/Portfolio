import { expect, test } from "@playwright/test";

const TITLE_REGEX = /Portfolio/;
const PROJECTS_URL_REGEX = /projects/;

test("Project navigation and SEO validation", async ({ page }) => {
  // 1. Go to Home Page
  await page.goto("/");
  await expect(page).toHaveTitle(TITLE_REGEX);

  // 2. Click on a Project (First project in the list)
  // Scroll to projects section to trigger GSAP animation
  const projectsSection = page.locator("#projects");
  await projectsSection.scrollIntoViewIfNeeded();

  // Wait for loader/splash to finish by waiting for the element to be visible
  const firstProjectCard = page.locator("a[href^='/projects/']").first();
  await firstProjectCard.waitFor({ state: "visible", timeout: 10_000 });

  const projectHref = await firstProjectCard.getAttribute("href");
  await firstProjectCard.click();

  // 3. Verify Project Page Loads
  await expect(page).toHaveURL(PROJECTS_URL_REGEX);
  // Verify Title exists (h1)
  const heading = page.locator("h1");
  await heading.waitFor({ state: "visible", timeout: 15_000 });
  await expect(heading).toBeVisible();

  // 4. Verify JSON-LD is present
  const jsonLdScript = page.locator('script[type="application/ld+json"]');
  await expect(jsonLdScript).toBeAttached();
  const jsonLdContent = await jsonLdScript.textContent();
  expect(jsonLdContent).toContain('"@type":"SoftwareApplication"');

  // 5. Navigate to Next Project
  // Scroll to bottom to find navigation
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  const nextProjectLink = page.locator("a[href^='/projects/']").last();
  // Ensure it's the navigation link at the bottom (usually "Next Project" or similar context)
  await expect(nextProjectLink).toBeVisible();
  await nextProjectLink.click();

  // 6. Verify URL changed (simple check)
  await expect(page).not.toHaveURL(projectHref || "");
});
