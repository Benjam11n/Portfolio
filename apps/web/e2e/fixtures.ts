import type { Page } from "@playwright/test";

// Contact form test data
export const validContactData = {
  email: "john.doe@example.com",
  message:
    "Hello! I am interested in discussing a potential project collaboration. Looking forward to hearing from you.",
  name: "John Doe",
};

// All project slugs to test
export const projectSlugs = [
  "disknee",
  "twinAI",
  "zucchini",
  "chip",
  "worldquant",
  "birds-of-a-feather",
] as const;

// Wait for page to be fully loaded (including animations)
export const waitForPageReady = async (page: Page) => {
  await page.waitForLoadState("networkidle");
  // Give animations time to start
  await page.waitForTimeout(500);
};
