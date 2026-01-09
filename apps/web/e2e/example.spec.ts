import { expect, test } from "@playwright/test";

const HOMEPAGE_TITLE_REGEX = /.*Benjamin Wang.*/i;

test("homepage loads successfully", async ({ page }) => {
  await page.goto("/");

  // Check that the page content loads
  // We can check for the document body or specific layout elements
  // For now, let's just assert the title or a generic element presence
  await expect(page).toHaveTitle(HOMEPAGE_TITLE_REGEX); // Assuming title contains name, adjust if needed
});
