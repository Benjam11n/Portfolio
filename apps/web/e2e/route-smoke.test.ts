import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

import { waitForPageReady } from "./fixtures";

const MOBILE_VIEWPORT = { height: 844, width: 390 };

const CONSOLE_ERROR_ALLOWLIST = [
  /favicon/i,
  /failed to load resource/i,
  /net::err_aborted/i,
  /_vercel\/insights\/script\.js/i,
];

const HOME_SECTION_HEADINGS = [
  "About Me",
  "Experience",
  "Projects",
  "Stacks & Skills",
  "Contact",
];

const routeChecks = [
  {
    path: "/",
    visibleText: "About Me",
  },
  {
    path: "/projects/zucchini",
    visibleText: "Zucchini",
  },
  {
    path: "/privacy",
    visibleText: "Privacy Policy",
  },
  {
    path: "/twdwfw",
    visibleText: "Page Not Found",
  },
];

const assertHomeSectionsVisible = async (page: Page) => {
  for (const heading of HOME_SECTION_HEADINGS) {
    const sectionHeading = page.getByRole("heading", {
      exact: true,
      name: heading,
    });
    await sectionHeading.scrollIntoViewIfNeeded();
    await expect(sectionHeading).toBeVisible();
  }

  await expect(page.locator(".experience-item").first()).toBeVisible();
  await expect(page.locator(".project-card-item").first()).toBeVisible();
};

const expectNoAppErrors = (messages: string[]) => {
  const appErrors = messages.filter(
    (message) =>
      !CONSOLE_ERROR_ALLOWLIST.some((pattern) => pattern.test(message))
  );

  expect(appErrors).toEqual([]);
};

const watchAppErrors = (page: Page) => {
  const messages: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      messages.push(message.text());
    }
  });
  page.on("pageerror", (error) => {
    messages.push(error.message);
  });

  return messages;
};

test.describe("Route smoke", () => {
  test.describe.configure({ mode: "serial" });

  test("core routes render without console or hydration errors", async ({
    page,
  }) => {
    const messages = watchAppErrors(page);

    for (const route of routeChecks) {
      await page.goto(route.path);
      await waitForPageReady(page);
      await expect(page.getByText(route.visibleText).first()).toBeVisible();
    }

    expectNoAppErrors(messages);
  });

  test("home sections become visible after browser back navigation", async ({
    page,
  }) => {
    const messages = watchAppErrors(page);

    await page.goto("/");
    await waitForPageReady(page);
    await page.goto("/projects/zucchini");
    await waitForPageReady(page);
    await page.goBack();
    await waitForPageReady(page);

    await assertHomeSectionsVisible(page);
    expectNoAppErrors(messages);
  });

  test("project route survives browser back and forward loops", async ({
    page,
  }) => {
    const messages = watchAppErrors(page);

    await page.goto("/");
    await waitForPageReady(page);
    await page.goto("/projects/zucchini");
    await expect(page).toHaveURL(/\/projects\/zucchini$/);
    await expect(page.getByRole("heading", { name: "Zucchini" })).toBeVisible();

    await page.goBack();
    await waitForPageReady(page);
    await assertHomeSectionsVisible(page);

    await page.goForward();
    await waitForPageReady(page);
    await expect(page).toHaveURL(/\/projects\/zucchini$/);
    await expect(page.getByRole("heading", { name: "Zucchini" })).toBeVisible();

    await page.goBack();
    await waitForPageReady(page);
    await assertHomeSectionsVisible(page);
    expectNoAppErrors(messages);
  });

  test("reduced motion keeps home and project content visible", async ({
    page,
  }) => {
    const messages = watchAppErrors(page);
    await page.emulateMedia({ reducedMotion: "reduce" });

    await page.goto("/");
    await waitForPageReady(page);
    await assertHomeSectionsVisible(page);

    await page.goto("/projects/zucchini");
    await waitForPageReady(page);
    await expect(page.getByRole("heading", { name: "Zucchini" })).toBeVisible();
    await expect(
      page.getByText(/local-first desktop habit tracker/i)
    ).toBeVisible();
    expectNoAppErrors(messages);
  });

  test("custom cursor appears over project cards", async ({ page }) => {
    await page.goto("/");
    await waitForPageReady(page);
    await page.waitForTimeout(1600);

    const projectCard = page
      .locator(".project-card-item[data-hover-cursor]")
      .first();
    await projectCard.scrollIntoViewIfNeeded();
    const cardBox = await projectCard.boundingBox();
    expect(cardBox).not.toBeNull();
    await page.mouse.move(
      (cardBox?.x ?? 0) + (cardBox?.width ?? 0) / 2,
      (cardBox?.y ?? 0) + (cardBox?.height ?? 0) / 2
    );

    const cursorOverlay = page.locator("[data-hover-cursor-overlay]");
    await expect(cursorOverlay).toHaveAttribute("data-active", "true");
    await expect(cursorOverlay.getByText("View project")).toBeVisible();
  });
});

test.describe("Mobile route smoke", () => {
  test.use({ viewport: MOBILE_VIEWPORT });

  for (const route of routeChecks) {
    test(`${route.path} renders on mobile`, async ({ page }) => {
      const messages = watchAppErrors(page);

      await page.goto(route.path);
      await waitForPageReady(page);
      await expect(page.getByText(route.visibleText).first()).toBeVisible();
      expectNoAppErrors(messages);
    });
  }
});
