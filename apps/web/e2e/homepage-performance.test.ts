import { expect, test } from "@playwright/test";

import { HOMEPAGE_MEDIA_BUDGETS } from "../lib/constants/homepage-media-budgets";

const HOMEPAGE_MEDIA_PREFIXES = [
  "/certifications/",
  "/experiences/",
  "/projects/",
];

const isHomepageMediaPath = (pathname: string) =>
  HOMEPAGE_MEDIA_PREFIXES.some((prefix) => pathname.startsWith(prefix));

test.describe("Homepage performance budgets", () => {
  test("keeps homepage media within route budget", async ({ page }) => {
    const responses: { bytes: number; pathname: string }[] = [];

    page.on("response", async (response) => {
      const url = new URL(response.url());
      if (!isHomepageMediaPath(url.pathname)) {
        return;
      }

      const contentLength = response.headers()["content-length"];
      const responseBody = contentLength ? null : await response.body();
      const bytes = contentLength ? Number(contentLength) : responseBody.length;

      responses.push({
        bytes,
        pathname: url.pathname,
      });
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });

    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "Projects" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Experience" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        exact: true,
        name: "Certifications & Courses",
      })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { exact: true, name: "Contact" })
    ).toBeVisible();

    const totalHomepageMediaBytes = responses.reduce(
      (sum, response) => sum + response.bytes,
      0
    );
    const gifRequests = responses.filter((response) =>
      response.pathname.endsWith(".gif")
    );
    const fullDemoVideoRequests = responses.filter((response) =>
      response.pathname.endsWith("/video.mp4")
    );
    const previewVideoRequests = responses.filter((response) =>
      response.pathname.endsWith("/preview.mp4")
    );

    expect(totalHomepageMediaBytes).toBeLessThanOrEqual(
      HOMEPAGE_MEDIA_BUDGETS.route.homepageMediaBytes
    );
    expect(gifRequests).toHaveLength(
      HOMEPAGE_MEDIA_BUDGETS.route.maxGifRequests
    );
    expect(fullDemoVideoRequests).toHaveLength(
      HOMEPAGE_MEDIA_BUDGETS.route.maxFullDemoVideoRequests
    );
    expect(previewVideoRequests).toHaveLength(
      HOMEPAGE_MEDIA_BUDGETS.route.maxPreviewVideoRequests
    );
  });
});
