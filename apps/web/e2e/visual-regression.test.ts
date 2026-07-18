import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

import { waitForPageReady } from "./fixtures";

const VIEWPORT = { height: 900, width: 1440 };

const prepareStablePage = async (page: Page) => {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        caret-color: transparent !important;
      }

      canvas,
      video,
      [data-hover-cursor-overlay],
      body > div.fixed.bottom-4.right-4 {
        visibility: hidden !important;
      }
    `,
  });
  await page.evaluate(() => document.fonts.ready);
};

const setTheme = async (page: Page, theme: "dark" | "light") => {
  await page.addInitScript((nextTheme) => {
    window.localStorage.setItem("theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }, theme);
};

const expectThemeClass = async (page: Page, theme: "dark" | "light") => {
  await expect(page.locator("html")).toHaveClass(
    theme === "dark" ? /dark/ : /^(?!.*\bdark\b).*/
  );
};

test.describe("Visual regression", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "Broad visual coverage stays Chromium-only"
  );
  test.describe.configure({ mode: "serial" });
  test.use({ reducedMotion: "reduce", viewport: VIEWPORT });

  test("captures homepage first viewport", async ({ page }) => {
    await page.goto("/");
    await waitForPageReady(page);
    await prepareStablePage(page);
    await expect(page).toHaveScreenshot("home.png", {
      animations: "disabled",
      caret: "hide",
    });
  });

  test("captures project page first viewport", async ({ page }) => {
    await page.goto("/projects/zucchini");
    await waitForPageReady(page);
    await prepareStablePage(page);
    await expect(page).toHaveScreenshot("project-zucchini.png", {
      animations: "disabled",
      caret: "hide",
    });
  });

  test("captures footer layout", async ({ page }) => {
    await page.goto("/");
    await waitForPageReady(page);
    await prepareStablePage(page);

    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toHaveScreenshot("footer.png", {
      animations: "disabled",
      caret: "hide",
      mask: [footer.getByText(/GMT[+-]?\d*/)],
      maxDiffPixels: 250,
    });
  });

  test("captures not found page", async ({ page }) => {
    await page.goto("/twdwfw");
    await waitForPageReady(page);
    await prepareStablePage(page);
    await expect(page).toHaveScreenshot("not-found.png", {
      animations: "disabled",
      caret: "hide",
    });
  });

  test("captures homepage light theme", async ({ page }) => {
    await setTheme(page, "light");
    await page.goto("/");
    await waitForPageReady(page);
    await expectThemeClass(page, "light");
    await prepareStablePage(page);
    await expect(page).toHaveScreenshot("home-light.png", {
      animations: "disabled",
      caret: "hide",
      mask: [page.locator("img")],
      maxDiffPixels: 2500,
    });
  });

  test("captures homepage dark theme", async ({ page }) => {
    await setTheme(page, "dark");
    await page.goto("/");
    await waitForPageReady(page);
    await expectThemeClass(page, "dark");
    await prepareStablePage(page);
    await expect(page).toHaveScreenshot("home-dark.png", {
      animations: "disabled",
      caret: "hide",
      mask: [page.locator("img")],
      maxDiffPixels: 2500,
    });
  });
});
