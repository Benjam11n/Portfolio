import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock GSAP for Card3D
vi.mock("@gsap/react", () => ({
  useGSAP: () => ({ contextSafe: (fn: unknown) => fn }),
}));

vi.mock("gsap", () => ({
  default: {
    to: vi.fn(),
  },
}));

import { ExperienceItem } from "./experience-item";

const mockExperience = {
  id: 1,
  name: "Test Company",
  pos: "Senior Developer",
  duration: "2023 - Present",
  points: [
    "Integrated **AI features** into the platform.",
    "improved performance by 50%.",
  ],
  icon: "/company-logo.png",
};

const TEXT_INTEGRATED = /Integrated/;
const TEXT_IMPROVED = /improved performance by 50%/;

describe("ExperienceItem", () => {
  it("renders experience details", () => {
    render(<ExperienceItem item={mockExperience} />);
    expect(screen.getByText("Test Company")).toBeDefined();
    expect(screen.getByText("Senior Developer")).toBeDefined();
    expect(screen.getByText("2023 - Present")).toBeDefined();
  });

  it("renders markdown points accurately", () => {
    render(<ExperienceItem item={mockExperience} />);

    // Check for bold text rendering
    const strongText = screen.getByText("AI features");
    expect(strongText.tagName).toBe("STRONG");

    // Check for normal text
    expect(screen.getByText(TEXT_INTEGRATED)).toBeDefined();
    expect(screen.getByText(TEXT_IMPROVED)).toBeDefined();
  });

  it("renders list items", () => {
    render(<ExperienceItem item={mockExperience} />);
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(2);
  });
});
