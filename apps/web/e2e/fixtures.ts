import type { Page } from "@playwright/test";

// Contact form test data
export const validContactData = {
  name: "John Doe",
  email: "john.doe@example.com",
  subject: "Project Inquiry",
  message:
    "Hello! I am interested in discussing a potential project collaboration. Looking forward to hearing from you.",
};

export const invalidContactData = {
  emptyFields: {
    name: "",
    email: "",
    subject: "",
    message: "",
  },
  invalidEmail: {
    name: "John Doe",
    email: "invalid-email",
    subject: "Test",
    message: "Test message",
  },
  shortMessage: {
    name: "John Doe",
    email: "john@example.com",
    subject: "Test",
    message: "Hi", // Too short if there's a minimum length
  },
};

// All project slugs to test
export const projectSlugs = [
  "disknee",
  "twinAI",
  "quickie",
  "chip",
  "worldquant",
  "birds-of-a-feather",
] as const;

// Viewport configurations
export const viewports = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 },
} as const;

// Navigation sections (anchors on home page)
export const navSections = [
  { name: "Home", href: "/" },
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Certifications", href: "#certifications" },
  { name: "Contact", href: "#contact" },
] as const;

// Wait for 3D canvas to initialize
export async function waitForCanvasReady(page: Page, timeout = 10_000) {
  await page.waitForFunction(
    () => {
      const canvases = document.querySelectorAll("canvas");
      return canvases.length > 0;
    },
    { timeout }
  );
}

// Wait for page to be fully loaded (including animations)
export async function waitForPageReady(page: Page) {
  await page.waitForLoadState("networkidle");
  // Give animations time to start
  await page.waitForTimeout(500);
}
