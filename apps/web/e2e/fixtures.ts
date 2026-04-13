import type { Page } from "@playwright/test";

// All project slugs to test
export const projectSlugs = [
  "disknee",
  "twinAI",
  "zucchini",
  "chip",
  "worldquant",
  "birds-of-a-feather",
] as const;

// Wait for page to be fully loaded
export const waitForPageReady = async (page: Page) => {
  await page.waitForLoadState("networkidle");
};
