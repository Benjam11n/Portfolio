import { expect, test } from "@playwright/test";
import type { Grecaptcha } from "@repo/testing/test-types";
import { validContactData, waitForPageReady } from "./fixtures";

// Regex patterns at top level for performance
const HOME_URL_REGEX = /\/$/;

test.describe("Contact Form", () => {
  test.beforeEach(async ({ page }) => {
    // Mock reCAPTCHA
    await page.addInitScript(() => {
      (window as Window & { grecaptcha?: Grecaptcha }).grecaptcha = {
        ready: (cb: () => void) => cb(),
        execute: () =>
          new Promise((resolve) =>
            setTimeout(() => resolve("mock-recaptcha-token"), 100)
          ),
        render: () => "mock-widget-id",
      } satisfies Grecaptcha;
    });

    await page.goto("/");
    await waitForPageReady(page);
    const contactSection = page.getByRole("heading", { name: "Contact" });
    await contactSection.scrollIntoViewIfNeeded();
    await expect(contactSection).toBeVisible();
  });

  test("form renders and validates correctly", async ({ page }) => {
    // Check form fields exist
    await expect(page.getByLabel("Name")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Subject")).toBeVisible();
    await expect(page.getByRole("button", { name: "Submit" })).toBeVisible();

    // Test validation - submit empty form
    await page.getByRole("button", { name: "Submit" }).click();
    await expect(page).toHaveURL(HOME_URL_REGEX);

    // Fill and verify form works
    await page.getByLabel("Name").fill(validContactData.name);
    await page.getByLabel("Email").fill(validContactData.email);
    await page.getByLabel("Subject").fill(validContactData.subject);
    await page
      .getByPlaceholder("Hello! I want to give you a job...")
      .fill(validContactData.message);

    await expect(page.getByLabel("Name")).toHaveValue(validContactData.name);
  });
});
