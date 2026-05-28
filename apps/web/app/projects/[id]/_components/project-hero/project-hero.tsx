"use client";

import { useRef } from "react";

import { ProjectHeroBackLink } from "@/app/projects/[id]/_components/project-hero/project-hero-back-link";
import { ProjectHeroHeader } from "@/app/projects/[id]/_components/project-hero/project-hero-header";
import { ProjectHeroVisual } from "@/app/projects/[id]/_components/project-hero/project-hero-visual";
import { useProjectHeroAnimation } from "@/app/projects/[id]/_components/project-hero/use-project-hero-animation";
import { getPrimaryProjectTitle } from "@/app/projects/[id]/_components/project-hero/utils";
import type { Project } from "@/lib/types";

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
