import { expect, test } from "@playwright/test";
import { waitForPageReady } from "./fixtures";

// Regex patterns at top level
const ABOUT_HASH_REGEX = /#about$/;
const SKIP_LINK_REGEX = /skip to main content/i;
const TOGGLE_THEME_REGEX = /toggle theme/i;

test.describe("Navigation", () => {
  test("skip link appears on tab", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");

    const skipLink = page.getByRole("link", { name: SKIP_LINK_REGEX });
    await expect(skipLink).toBeVisible();
    await expect(skipLink).toBeFocused();
  });

  test("nav links work", async ({ page }) => {
    await page.goto("/");
    await waitForPageReady(page);

    // Use first() to avoid strict mode violation (nav has About, footer also has About)
    await page.getByRole("link", { name: "About" }).first().click();
    await page.waitForTimeout(500);

    await expect(page).toHaveURL(ABOUT_HASH_REGEX);
  });

  test("theme toggle works", async ({ page }) => {
    await page.goto("/");
    await waitForPageReady(page);

    const themeToggle = page.getByRole("button", { name: TOGGLE_THEME_REGEX });
    const initialTheme = await page.evaluate(() =>
      document.documentElement.classList.contains("dark") ? "dark" : "light"
    );

    await themeToggle.click();
    await page.waitForTimeout(300);

    const newTheme = await page.evaluate(() =>
      document.documentElement.classList.contains("dark") ? "dark" : "light"
    );

    expect(newTheme).not.toBe(initialTheme);
  });
});
