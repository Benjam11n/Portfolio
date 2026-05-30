import { ExternalLink, Github } from "lucide-react";

import { ShiftButton } from "@/components/shared/shift-button";
import type { Project } from "@/lib/types";

interface ProjectHeroActionsProps {
  project: Project;
}

export const ProjectHeroActions = ({ project }: ProjectHeroActionsProps) => {
  if (!(project.href || project.github)) {
    return null;
  }

  return (
    <div className="hero-header-item flex flex-wrap gap-3">
      {project.href && (
        <ShiftButton
          href={project.href}
          icon={<ExternalLink className="size-4" />}
          rel="noopener noreferrer"
          target="_blank"
        >
          Live Site
        </ShiftButton>
      )}

      {project.github && (
        <ShiftButton
          href={project.github}
          icon={<Github className="size-4" />}
          rel="noopener noreferrer"
          target="_blank"
          variant="secondary"
        >
          Source Code
        </ShiftButton>
      )}
    </div>
  );
};
