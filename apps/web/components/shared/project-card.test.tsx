import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProjectCard } from "./project-card";

// Mock GSAP
vi.mock("@gsap/react", () => ({
  useGSAP: () => ({ contextSafe: (fn: any) => fn }),
}));

vi.mock("gsap", () => ({
  default: {
    to: vi.fn(),
  },
}));

// Mock Magnetic
vi.mock("../effects/magnetic", () => ({
  Magnetic: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const VIEW_PROJECT_REGEX = /View project: Test Project - Subtitle/i;

const mockProject = {
  id: "test-project",
  title: "Test Project - Subtitle",
  description: "A test project description",
  tags: ["React", "TypeScript"],
  hero_image: "/test-image.jpg",
  logo: "/test-logo.png",
  logoStyle: {},
  techStack: ["React"],
  liveLink: "https://example.com",
  githubLink: "https://github.com",
  video_overview: undefined,
  features: [],
  challenges: [],
  learnings: [],
  year: "2024",
  client: "Personal",
  services: "Web Development",
  location: "Remote",
};

const SUBTITLE_REGEX = /Subtitle/;

describe("ProjectCard", () => {
  it("renders project title and subtitle", () => {
    render(
      <TooltipProvider>
        <ProjectCard project={mockProject} />
      </TooltipProvider>
    );
    expect(screen.getAllByText("Test Project")).toHaveLength(2);
    expect(screen.getByText(SUBTITLE_REGEX)).toBeDefined();
  });

  it("renders project image", () => {
    render(
      <TooltipProvider>
        <ProjectCard project={mockProject} />
      </TooltipProvider>
    );
    // Check for alt text
    const img = screen.getByAltText("Test Project - Subtitle");
    expect(img).toBeDefined();
  });

  it("renders accessible link to details", () => {
    render(
      <TooltipProvider>
        <ProjectCard project={mockProject} />
      </TooltipProvider>
    );
    const link = screen.getByRole("link", {
      name: VIEW_PROJECT_REGEX,
    });
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe("/projects/test-project");
  });
});
