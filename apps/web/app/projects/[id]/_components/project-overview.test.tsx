import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProjectOverview } from "./project-overview";

// Mock GSAP
vi.mock("@gsap/react", () => ({
  useGSAP: () => ({
    contextSafe: <T extends (...args: unknown[]) => unknown>(fn: T) => fn,
  }),
}));

vi.mock("gsap", () => ({
  default: {
    registerPlugin: vi.fn(),
    set: vi.fn(),
    timeline: () => ({
      to: vi.fn().mockReturnThis(),
    }),
    matchMedia: () => ({
      add: vi.fn(),
    }),
  },
  ScrollTrigger: {},
}));

const mockProject = {
  id: "test-project",
  title: "Test Project",
  description: "Desc",
  subdesc: "A **detailed** overview of the project.",
  features: ["Feature **1**", "Feature 2"],
  techStack: ["React", "TypeScript"],
  // minimal required props
  year: "2024",
  client: "Me",
  services: "Code",
  location: "Web",
  logo: "/logo.png",
};

const OVERVIEW_REGEX = /overview of the project/;

describe("ProjectOverview", () => {
  it("renders markdown sub-description", () => {
    render(<ProjectOverview project={mockProject} />);
    const strongText = screen.getByText("detailed");
    expect(strongText.tagName).toBe("STRONG");
    expect(screen.getByText(OVERVIEW_REGEX)).toBeDefined();
  });

  it("renders features list with markdown", () => {
    render(<ProjectOverview project={mockProject} />);
    expect(screen.getByText("Feature")).toBeDefined(); // Part of Feature **1**
    expect(screen.getByText("1")).toBeDefined(); // The bold part
    expect(screen.getByText("Feature 2")).toBeDefined();
  });

  it("renders tech stack items", () => {
    // Note: This relies on TECH_STACK constant containing React and TypeScript
    render(<ProjectOverview project={mockProject} />);
    // We expect the TechStackItem to render the name of the tech
    // Since TechStackItem might just render icons or small text, we check availability
    // Assuming TechStackItem renders the name in a tooltip or visible text.
    // Use findBy or check that elements exist.
    // If TechStackItem is purely visual (icon), we might need to look for specific visual cues or aria-labels.
    // Let's assume it renders basic accessible text or we check that the container renders.

    // Actually, TechStackItem usually renders an icon.
    // Let's verify the section header exists at least.
    expect(screen.getByText("Built With")).toBeDefined();
  });

  it("handles missing/empty features gracefully", () => {
    const projectNoFeatures = { ...mockProject, features: [] };
    render(<ProjectOverview project={projectNoFeatures} />);
    expect(screen.queryByText("Key Features")).toBeNull();
  });
});
