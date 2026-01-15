import { expect, test } from "@playwright/test";
import { validContactData, waitForPageReady } from "./fixtures";

// Regex patterns at top level for performance
const HOME_URL_REGEX = /\/$/;

test.describe("Contact Form", () => {
  test.beforeEach(async ({ page }) => {
    // Mock reCAPTCHA
    await page.addInitScript(() => {
      (window as any).grecaptcha = {
        ready: (cb: () => void) => cb(),
        execute: () => Promise.resolve("mock-recaptcha-token"),
      };
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

  test("disables all inputs during form submission", async ({ page }) => {
    // Fill form with valid data
    await page.getByLabel("Name").fill(validContactData.name);
    await page.getByLabel("Email").fill(validContactData.email);
    await page.getByLabel("Subject").fill(validContactData.subject);
    await page
      .getByPlaceholder("Hello! I want to give you a job...")
      .fill(validContactData.message);

    // Intercept the form submission to delay it
    let submissionResolved = false;
    await page.route("**/api/contact", async (route) => {
      // Keep the request pending briefly to verify disabled state
      await page.waitForTimeout(500);
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
      submissionResolved = true;
    });

    // Click submit button
    await page.getByRole("button", { name: "Submit" }).click();

    // Verify all inputs are disabled during submission
    await expect(page.getByLabel("Name")).toBeDisabled();
    await expect(page.getByLabel("Email")).toBeDisabled();
    await expect(page.getByLabel("Subject")).toBeDisabled();
    await expect(
      page.getByPlaceholder("Hello! I want to give you a job...")
    ).toBeDisabled();

    // Verify submit button is also disabled
    await expect(page.getByRole("button", { name: "Submit" })).toBeDisabled();

    // Wait for submission to complete
    await page.waitForTimeout(600);
    expect(submissionResolved).toBe(true);
  });
});
