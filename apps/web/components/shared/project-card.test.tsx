import { render, screen } from "@repo/testing/test-utils";

import { ProjectCard } from "./project-card";

const VIEW_PROJECT_REGEX = /View project: Test Project - Subtitle/i;

const mockProject = {
  challenges: [],
  client: "Personal",
  description: "A test project description",
  features: [],
  githubLink: "https://github.com",
  hero_image: "/test-image.jpg",
  id: "test-project",
  learnings: [],
  liveLink: "https://example.com",
  location: "Remote",
  logo: "/test-logo.png",
  logoStyle: {},
  services: "Web Development",
  tags: ["React", "TypeScript"],
  techStack: ["React"],
  title: "Test Project - Subtitle",
  video_overview: undefined,
  year: "2024",
};

const SUBTITLE_REGEX = /Subtitle/;

describe(ProjectCard, () => {
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
    expect(link).toHaveAttribute("data-hover-cursor-label", "Click me!");
    expect(link).toHaveAttribute("href", "/projects/test-project");
  });
});
