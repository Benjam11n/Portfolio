import { render, screen } from "@testing-library/react";

import type { Project, TechId } from "@/lib/types";

import { ProjectOverview } from "./project-overview";

const mockProject: Project = {
  client: "Me",
  description: "Desc",
  features: ["Feature **1**", "Feature 2"],
  id: "test-project",
  location: "Web",
  logo: "/logo.png",
  services: "Code",
  subdesc: "A **detailed** overview of the project.",
  techStack: ["react", "typescript"],
  title: "Test Project",
  year: 2024,
};

describe(ProjectOverview, () => {
  it("renders the markdown overview copy", () => {
    render(<ProjectOverview project={mockProject} />);

    expect(screen.getByText("detailed").tagName).toBe("STRONG");
    expect(screen.getByText(/overview of the project/i)).toBeInTheDocument();
  });

  it("renders all feature cards when the feature count is odd", () => {
    render(
      <ProjectOverview
        project={{
          ...mockProject,
          features: ["Feature 1", "Feature 2", "Feature 3"],
        }}
      />
    );

    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("Feature 1")).toBeInTheDocument();
    expect(screen.getByText("Feature 2")).toBeInTheDocument();
    expect(screen.getByText("Feature 3")).toBeInTheDocument();
  });

  it("renders known tech stack items and skips unknown ids", () => {
    render(
      <ProjectOverview
        project={{
          ...mockProject,
          techStack: ["react", "unknown-tech" as TechId, "typescript"],
        }}
      />
    );

    expect(screen.getByText("Built With")).toBeInTheDocument();
    expect(screen.getByAltText("React")).toBeInTheDocument();
    expect(screen.getByAltText("TypeScript")).toBeInTheDocument();
  });

  it("hides the features section when there are no project features", () => {
    render(
      <ProjectOverview
        project={{
          ...mockProject,
          features: [],
        }}
      />
    );

    expect(screen.queryByText("Key Features")).not.toBeInTheDocument();
  });
});
