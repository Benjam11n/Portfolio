"use client";

import { SectionCard } from "@/components/section-card";
import { PROJECTS } from "@/constants";
import { ProjectCard } from "./project-card";

export const Projects = () => {
  const projects = Object.values(PROJECTS);

  return (
    <SectionCard id="projects" title="Projects">
      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </SectionCard>
  );
};
