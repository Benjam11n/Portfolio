import { expect, test } from "@playwright/test";

import { waitForPageReady } from "./fixtures";

const SUCCESS_DESCRIPTION = "Your message has been sent successfully.";

test.describe("Contact form", () => {
  test("submits successfully", async ({ page }) => {
    await page.goto("/");
    await waitForPageReady(page);

    const contactSection = page.locator("#contact");
    await contactSection.scrollIntoViewIfNeeded();

    const nameInput = page.getByLabel("Name");
    const emailInput = page.getByLabel("Email");
    const messageInput = page.getByPlaceholder(
      "Hello! I want to give you a job..."
    );

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(messageInput).toBeVisible();

    await nameInput.fill("Playwright User");
    await emailInput.fill("playwright@example.com");
    await messageInput.fill(
      "Hello Benjamin, this is a Playwright smoke test for the contact form."
    );

    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByText("Thanks Playwright User!")).toBeVisible();
    await expect(
      page.getByText(SUCCESS_DESCRIPTION, { exact: true })
    ).toBeVisible();
    await expect(nameInput).toHaveValue("");
    await expect(emailInput).toHaveValue("");
    await expect(messageInput).toHaveValue("");
  });
});
