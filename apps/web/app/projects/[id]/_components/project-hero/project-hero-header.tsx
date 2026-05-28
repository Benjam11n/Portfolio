import { ProjectHeroActions } from "@/app/projects/[id]/_components/project-hero/project-hero-actions";
import { ProjectHeroHeading } from "@/app/projects/[id]/_components/project-hero/project-hero-heading";
import { Markdown } from "@/components/shared/markdown";
import type { Project } from "@/lib/types";

interface ProjectHeroHeaderProps {
  project: Project;
  title: string;
}

export const ProjectHeroHeader = ({
  project,
  title,
}: ProjectHeroHeaderProps) => (
  <div className="mb-8">
    <ProjectHeroHeading project={project} title={title} />
    <div className="hero-header-item mb-6 max-w-2xl text-pretty text-base text-muted-foreground leading-relaxed sm:text-lg">
      <Markdown>{project.description}</Markdown>
    </div>
    <ProjectHeroActions project={project} />
  </div>
);
