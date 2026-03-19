import { render, screen } from "@repo/testing/test-utils";
import { describe, expect, it } from "vitest";
import { ProjectCard } from "./project-card";

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
    render(<ProjectCard project={mockProject} />);
    expect(screen.getAllByText("Test Project")).toHaveLength(2);
    expect(screen.getByText(SUBTITLE_REGEX)).toBeInTheDocument();
  });

  it("renders project image", () => {
    render(<ProjectCard project={mockProject} />);
    // Check for alt text
    const img = screen.getByAltText("Test Project - Subtitle");
    expect(img).toBeInTheDocument();
  });

  it("renders accessible link to details", () => {
    render(<ProjectCard project={mockProject} />);
    const link = screen.getByRole("link", {
      name: VIEW_PROJECT_REGEX,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("data-hover-cursor");
    expect(link).toHaveAttribute("data-hover-cursor-label", "View Details");
    expect(link).toHaveAttribute("href", "/projects/test-project");
  });
});
