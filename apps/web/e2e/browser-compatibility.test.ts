import { expect, test } from "@playwright/test";
import type { BrowserName, Locator, Page } from "@playwright/test";

import { waitForPageReady } from "./fixtures";

const VIEWPORT = { height: 900, width: 1440 };
const STATE_SETTLE_MS = 700;

const SCREENSHOT_OPTIONS = {
  animations: "disabled" as const,
  caret: "hide" as const,
  maxDiffPixelRatio: 0.01,
  timeout: 10_000,
};

const prepareHomepage = async (page: Page, browserName: BrowserName) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "hardwareConcurrency", {
      configurable: true,
      value: 2,
    });
  });
  await page.goto("/");
  await waitForPageReady(page);
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        caret-color: transparent !important;
      }

      html {
        scroll-behavior: auto !important;
      }

      canvas,
      video,
      [data-hover-cursor-overlay],
      body > div.fixed.bottom-4.right-4 {
        visibility: hidden !important;
      }
    `,
  });

  const interactiveCards = page.locator("[role='presentation']");
  await (browserName === "webkit"
    ? expect(interactiveCards).toHaveCount(0)
    : expect.poll(() => interactiveCards.count()).toBeGreaterThan(0));
};

const settleElement = async (element: Locator) => {
  await element.scrollIntoViewIfNeeded();
  await expect(element).toBeVisible();
  await expect(element).toHaveCSS("opacity", "1");
  await element.locator("img").evaluateAll(async (images) => {
    await Promise.all(
      images.map(async (image) => {
        const htmlImage = image as HTMLImageElement;
        if (!htmlImage.complete) {
          await htmlImage.decode().catch(() => {});
        }
      })
    );
  });
  await element.page().waitForTimeout(STATE_SETTLE_MS);
};

const movePointerAway = async (page: Page) => {
  await page.mouse.move(0, 0);
  await page.waitForTimeout(STATE_SETTLE_MS);
};

const warmHoverState = async (element: Locator) => {
  await element.hover();
  await element.page().waitForTimeout(STATE_SETTLE_MS);
  await movePointerAway(element.page());
};

test.describe("Cross-browser compatibility", () => {
  test.describe.configure({ mode: "serial" });
  test.use({ viewport: VIEWPORT });

  test("uses stable browser-specific effects and core navigation", async ({
    browserName,
    page,
  }) => {
    await prepareHomepage(page, browserName);
    await page.waitForTimeout(1600);

    const projectCard = page.locator(".project-card-item").first();
    await settleElement(projectCard);

    const interactiveCards = page.locator("[role='presentation']");
    const cursorOverlay = page.locator("[data-hover-cursor-overlay]");

    if (browserName === "webkit") {
      await expect(interactiveCards).toHaveCount(0);
      await expect(cursorOverlay).toHaveCount(0);
    } else {
      expect(await interactiveCards.count()).toBeGreaterThan(0);
      await expect(cursorOverlay).toBeAttached();
      await projectCard.hover();
      await expect(cursorOverlay).toHaveAttribute("data-active", "true");
      await expect(cursorOverlay.getByText("View project")).toBeAttached();
    }

    const themeToggle = page.getByRole("button", { name: /toggle theme/i });
    const initialTheme = await page.locator("html").getAttribute("class");
    await themeToggle.click();
    await expect(page.locator("html")).not.toHaveAttribute(
      "class",
      initialTheme ?? ""
    );

    await projectCard.scrollIntoViewIfNeeded();
    await Promise.all([
      page.waitForURL(/\/projects\/zucchini$/, { timeout: 15_000 }),
      projectCard.click(),
    ]);
    await expect(page.getByRole("heading", { name: "Zucchini" })).toBeVisible({
      timeout: 15_000,
    });
  });

  test("keeps experience card visible across interaction states", async ({
    browserName,
    page,
  }) => {
    await prepareHomepage(page, browserName);

    const experienceCard = page.locator(".experience-item").nth(1);
    const experienceButton = experienceCard.getByRole("button");
    await settleElement(experienceCard);

    await expect(experienceCard).toHaveScreenshot(
      "experience-idle.png",
      SCREENSHOT_OPTIONS
    );
    await experienceCard.hover();
    await page.waitForTimeout(STATE_SETTLE_MS);
    await expect(experienceCard).toHaveScreenshot(
      "experience-hover.png",
      SCREENSHOT_OPTIONS
    );

    await movePointerAway(page);
    await experienceButton.focus();
    await expect(experienceButton).toBeFocused();
    await expect(experienceCard).toHaveScreenshot(
      "experience-focus.png",
      SCREENSHOT_OPTIONS
    );

    await experienceButton.press("Enter");
    await expect(experienceButton).toHaveAttribute("aria-expanded", "true");
    await expect(
      experienceCard.locator("[id^='experience-content-']")
    ).toHaveCSS("opacity", "1", { timeout: 20_000 });
    await experienceCard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    await expect(experienceCard).toHaveScreenshot(
      "experience-expanded.png",
      SCREENSHOT_OPTIONS
    );
  });

  test("keeps project card visible after hover and keyboard focus", async ({
    browserName,
    page,
  }) => {
    await prepareHomepage(page, browserName);

    const projectCard = page.locator(".project-card-item").first();
    await settleElement(projectCard);
    await warmHoverState(projectCard);

    await expect(projectCard).toHaveScreenshot(
      "project-idle.png",
      SCREENSHOT_OPTIONS
    );
    await projectCard.hover();
    await page.waitForTimeout(STATE_SETTLE_MS);
    await expect(projectCard).toHaveScreenshot(
      "project-hover.png",
      SCREENSHOT_OPTIONS
    );

    await movePointerAway(page);
    await projectCard.focus();
    await expect(projectCard).toBeFocused();
    await expect(projectCard).toHaveScreenshot(
      "project-focus.png",
      SCREENSHOT_OPTIONS
    );

    await projectCard.evaluate((element: HTMLElement) => element.blur());
    await movePointerAway(page);
    await expect(projectCard).toBeVisible();
    await expect(projectCard).toHaveScreenshot(
      "project-idle.png",
      SCREENSHOT_OPTIONS
    );
  });

  test("keeps certification card visible after hover", async ({
    browserName,
    page,
  }) => {
    await prepareHomepage(page, browserName);

    const certificationCard = page.locator(".cert-card").first();
    await settleElement(certificationCard);
    await warmHoverState(certificationCard);

    await expect(certificationCard).toHaveScreenshot(
      "certification-idle.png",
      SCREENSHOT_OPTIONS
    );
    await certificationCard.hover();
    await page.waitForTimeout(STATE_SETTLE_MS);
    await expect(certificationCard).toHaveScreenshot(
      "certification-hover.png",
      SCREENSHOT_OPTIONS
    );

    await movePointerAway(page);
    await expect(certificationCard).toBeVisible();
    await expect(certificationCard).toHaveScreenshot(
      "certification-idle.png",
      SCREENSHOT_OPTIONS
    );
  });
});
