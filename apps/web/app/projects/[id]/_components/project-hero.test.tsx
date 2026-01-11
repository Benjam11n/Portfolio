import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProjectHero } from "./project-hero";

// Mock GSAP
vi.mock("@gsap/react", () => ({
  useGSAP: () => ({ contextSafe: (fn: any) => fn }),
}));

vi.mock("gsap", () => ({
  default: {
    set: vi.fn(),
    timeline: () => ({
      to: vi.fn().mockReturnThis(),
    }),
  },
}));

const mockProject = {
  id: "test-project",
  title: "Test Project - Subtitle",
  description: "A **test** project description",
  tags: ["React"],
  year: "2024",
  client: "Personal",
  services: "Web",
  location: "Remote",
  techStack: ["React"],
  logo: "/logo.png",
  logoStyle: { backgroundColor: "#000" },
  hero_image: "/hero.jpg",
  href: "https://example.com",
  github: "https://github.com/test",
};

const DESCRIPTION_REGEX = /project description/;

describe("ProjectHero", () => {
  it("renders project title splitted correctly", () => {
    render(<ProjectHero project={mockProject} />);
    // visual splitting logic is: title.split(" - ")[0]
    expect(screen.getByText("Test Project")).toBeDefined();
  });

  it("renders markdown description", () => {
    render(<ProjectHero project={mockProject} />);
    // Check for bold text part
    const strongText = screen.getByText("test");
    expect(strongText.tagName).toBe("STRONG");
    expect(screen.getByText(DESCRIPTION_REGEX)).toBeDefined();
  });

  it("renders links when provided", () => {
    render(<ProjectHero project={mockProject} />);
    expect(screen.getByText("Live Site")).toBeDefined();
    expect(screen.getByText("Source Code")).toBeDefined();
  });

  it("renders hero image", () => {
    render(<ProjectHero project={mockProject} />);
    const img = screen.getByAltText("Test Project - Subtitle hero");
    expect(img).toBeDefined();
  });

  it("handles missing links gracefully", () => {
    const projectNoLinks = {
      ...mockProject,
      href: undefined,
      github: undefined,
    };
    render(<ProjectHero project={projectNoLinks} />);
    expect(screen.queryByText("Live Site")).toBeNull();
    expect(screen.queryByText("Source Code")).toBeNull();
  });
});
