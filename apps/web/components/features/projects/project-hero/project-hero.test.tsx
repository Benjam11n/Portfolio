import { fireEvent, render, screen } from "@testing-library/react";

import type { Project } from "@/lib/types";

import { ProjectHero } from "./project-hero";

vi.mock(import("@gsap/react") as unknown as string, () => ({
  useGSAP: () => ({
    contextSafe: <T extends (...args: unknown[]) => unknown>(fn: T) => fn,
  }),
}));

vi.mock(import("gsap") as unknown as string, () => ({
  default: {
    set: vi.fn(),
    timeline: () => ({
      to: vi.fn().mockReturnThis(),
    }),
  },
}));

const mockProject: Project = {
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
  techStack: ["react"],
  title: "Test Project - Subtitle",
  year: 2024,
};

describe(ProjectHero, () => {
  it("renders the back link, primary title, and markdown description", () => {
    render(<ProjectHero project={mockProject} />);

    expect(
      screen.getByRole("link", { name: /back to portfolio/i })
    ).toHaveAttribute("href", "/#projects");
    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(screen.getByText("test").tagName).toBe("STRONG");
    expect(screen.getByText(/project description/i)).toBeInTheDocument();
  });

  it("renders external project links with secure target attributes", () => {
    render(<ProjectHero project={mockProject} />);

    expect(screen.getByRole("link", { name: "Live Site" })).toHaveAttribute(
      "href",
      "https://example.com"
    );
    expect(screen.getByRole("link", { name: "Live Site" })).toHaveAttribute(
      "target",
      "_blank"
    );
    expect(screen.getByRole("link", { name: "Source Code" })).toHaveAttribute(
      "rel",
      "noopener noreferrer"
    );
  });

  it("falls back to an unavailable state when the hero image fails to load", () => {
    render(<ProjectHero project={mockProject} />);

    fireEvent.error(screen.getByAltText("Test Project - Subtitle hero"));

    expect(screen.getByText("Hero image not available")).toBeInTheDocument();
  });

  it("hides optional external links when the project does not provide them", () => {
    render(
      <ProjectHero
        project={{
          ...mockProject,
          github: undefined,
          href: undefined,
        }}
      />
    );

    expect(
      screen.queryByRole("link", { name: "Live Site" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Source Code" })
    ).not.toBeInTheDocument();
  });
});
