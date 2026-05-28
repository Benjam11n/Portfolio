"use client";

import Link from "next/link";
import { memo } from "react";

import { Card3D } from "@/components/effects/card-3d";
import { ProjectCardPreview } from "@/components/shared/project-card/project-card-preview";
import { ProjectCardTechList } from "@/components/shared/project-card/project-card-tech-list";
import { ProjectCardTitle } from "@/components/shared/project-card/project-card-title";
import { useProjectCardPreview } from "@/components/shared/project-card/use-project-card-preview";
import {
  getProjectPreviewPoster,
  splitProjectTitle,
} from "@/components/shared/project-card/utils";
import { ROUTES } from "@/lib/constants/navigation";
import type { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = memo(({ project }: ProjectCardProps) => {
  const title = splitProjectTitle(project.title);
  const previewPoster = getProjectPreviewPoster(project);
  const preview = useProjectCardPreview({
    hasPreviewVideo: Boolean(project.preview_video),
  });

  return (
    <Card3D className="p-2 shadow-sm sm:p-3" variant="standard">
      <Link
        aria-label={`View project: ${project.title}`}
        className="project-card-item group block w-full cursor-pointer"
        data-hover-cursor=""
        data-hover-cursor-icon="arrow-up-right"
        data-hover-cursor-label="View project"
        href={ROUTES.PROJECT_DETAIL(project.id)}
        onBlur={preview.handleStopPreview}
        onFocus={preview.handleStartPreview}
        onMouseEnter={preview.handleStartPreview}
        onMouseLeave={preview.handleStopPreview}
      >
        <ProjectCardPreview
          isPreviewVisible={preview.isPreviewVisible}
          mainTitle={title.main}
          onPreviewLoadedData={preview.handlePreviewLoadedData}
          previewPoster={previewPoster}
          previewVideoRef={preview.previewVideoRef}
          project={project}
          shouldLoadPreview={preview.shouldLoadPreview}
        />

        <div className="mt-4 flex flex-col items-center gap-2 px-2 pb-2">
          <ProjectCardTitle main={title.main} sub={title.sub} />
          <ProjectCardTechList techStack={project.techStack} />
        </div>
      </Link>
    </Card3D>
  );
});

ProjectCard.displayName = "ProjectCard";
