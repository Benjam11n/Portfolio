"use client";

import { useState } from "react";
import { SectionCard } from "@/components/section-card";
import { PROJECTS } from "@/constants";
import { ProjectCard } from "./project-card";
import { ProjectDetails } from "./project-details";

export const Projects = () => {
  const projects = Object.values(PROJECTS);
  const [selectedProject, setSelectedProject] = useState<
    (typeof projects)[0] | null
  >(null);

  return (
    <>
      <SectionCard id="projects" title="Projects">
        <div className="grid grid-cols-1 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              onClick={() => setSelectedProject(project)}
              project={project}
            />
          ))}
        </div>
      </SectionCard>

      {selectedProject && (
        <ProjectDetails
          isOpen
          onClose={() => setSelectedProject(null)}
          project={selectedProject}
        />
      )}
    </>
  );
};
