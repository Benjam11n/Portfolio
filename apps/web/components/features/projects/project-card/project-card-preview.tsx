import type { RefObject } from "react";

import { ProjectCardHeroImage } from "@/components/features/projects/project-card/project-card-hero-image";
import { ProjectCardLogoOverlay } from "@/components/features/projects/project-card/project-card-logo-overlay";
import { ProjectCardPreviewPoster } from "@/components/features/projects/project-card/project-card-preview-poster";
import { ProjectCardPreviewVideo } from "@/components/features/projects/project-card/project-card-preview-video";
import type { Project } from "@/lib/types";

interface ProjectCardPreviewProps {
  isPreviewVisible: boolean;
  mainTitle: string;
  onPreviewLoadedData: () => void;
  previewPoster?: string;
  previewVideoRef: RefObject<HTMLVideoElement | null>;
  project: Project;
  shouldLoadPreview: boolean;
}

export const ProjectCardPreview = ({
  isPreviewVisible,
  mainTitle,
  onPreviewLoadedData,
  previewPoster,
  previewVideoRef,
  project,
  shouldLoadPreview,
}: ProjectCardPreviewProps) => (
  <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-secondary">
    <ProjectCardHeroImage project={project} />

    {shouldLoadPreview && (
      <ProjectCardPreviewVideo
        isVisible={isPreviewVisible}
        onLoadedData={onPreviewLoadedData}
        poster={previewPoster}
        project={project}
        videoRef={previewVideoRef}
      />
    )}

    {shouldLoadPreview && (
      <ProjectCardPreviewPoster
        isPreviewVisible={isPreviewVisible}
        previewPoster={previewPoster}
      />
    )}

    <ProjectCardLogoOverlay mainTitle={mainTitle} project={project} />
  </div>
);
