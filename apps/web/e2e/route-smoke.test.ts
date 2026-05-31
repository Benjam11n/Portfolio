import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

import { waitForPageReady } from "./fixtures";

const CONSOLE_ERROR_ALLOWLIST = [
  /favicon/i,
  /failed to load resource/i,
  /net::err_aborted/i,
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
    expectNoAppErrors(messages);
  });
});
