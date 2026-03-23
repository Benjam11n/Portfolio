import { render, screen } from "@testing-library/react";

import { ProjectHero } from "./project-hero";

// Mock GSAP
vi.mock(import("@gsap/react"), () => ({
  useGSAP: () => ({
    contextSafe: <T extends (...args: unknown[]) => unknown>(fn: T) => fn,
  }),
}));

vi.mock(import("gsap"), () => ({
  default: {
    set: vi.fn(),
    timeline: () => ({
      to: vi.fn().mockReturnThis(),
    }),
  },
}));

// Mock new hooks for CharacterReveal component compatibility
vi.mock(import("@/lib/hooks/ui/use-character-reveal"), () => ({
  useCharacterReveal: () => ({
    animateIn: vi.fn(),
    animateOut: vi.fn(),
    setInitialState: vi.fn(),
  }),
}));

vi.mock(import("@/lib/hooks/ui/use-prefers-reduced-motion"), () => ({
  usePrefersReducedMotion: () => false,
}));

const mockProject = {
  client: "Personal",
  description: "A **test** project description",
  github: "https://github.com/test",
  hero_image: "/hero.jpg",
  href: "https://example.com",
  id: "test-project",
  location: "Remote",
  logo: "/logo.png",
  logoStyle: { backgroundColor: "#000" },
  services: "Web",
  tags: ["React"],
  techStack: ["React"],
  title: "Test Project - Subtitle",
  year: "2024",
};

const DESCRIPTION_REGEX = /project description/;
const BACK_TO_PORTFOLIO_REGEX = /back to portfolio/i;

describe(ProjectHero, () => {
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

  it("renders the redesigned back link", () => {
    render(<ProjectHero project={mockProject} />);
    expect(
      screen.getByRole("link", { name: BACK_TO_PORTFOLIO_REGEX })
    ).toHaveAttribute("href", "/#projects");
    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  it("renders hero image", () => {
    render(<ProjectHero project={mockProject} />);
    const img = screen.getByAltText("Test Project - Subtitle hero");
    expect(img).toBeDefined();
  });

  it("handles missing links gracefully", () => {
    const projectNoLinks = {
      ...mockProject,
      github: undefined,
      href: undefined,
    };
    render(<ProjectHero project={projectNoLinks} />);
    expect(screen.queryByText("Live Site")).toBeNull();
    expect(screen.queryByText("Source Code")).toBeNull();
  });
});
