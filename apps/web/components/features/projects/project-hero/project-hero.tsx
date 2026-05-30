"use client";

import { useRef } from "react";

import { ProjectHeroBackLink } from "@/components/features/projects/project-hero/project-hero-back-link";
import { ProjectHeroHeader } from "@/components/features/projects/project-hero/project-hero-header";
import { ProjectHeroVisual } from "@/components/features/projects/project-hero/project-hero-visual";
import { useProjectHeroAnimation } from "@/components/features/projects/project-hero/use-project-hero-animation";
import type { Project } from "@/lib/types";
import { getPrimaryProjectTitle } from "@/lib/utils/project-title";

interface ProjectHeroProps {
  project: Project;
}

export const ProjectHero = ({ project }: ProjectHeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const title = getPrimaryProjectTitle(project.title);

  useProjectHeroAnimation(containerRef);

  return (
    <div className="w-full" ref={containerRef}>
      <ProjectHeroBackLink />
      <ProjectHeroHeader project={project} title={title} />
      <ProjectHeroVisual project={project} />
    </div>
  );
};
