import type { RefObject } from "react";

import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProjectCardPreviewVideoProps {
  isVisible: boolean;
  onLoadedData: () => void;
  poster?: string;
  project: Project;
  videoRef: RefObject<HTMLVideoElement | null>;
}

export const ProjectCardPreviewVideo = ({
  isVisible,
  onLoadedData,
  poster,
  project,
  videoRef,
}: ProjectCardPreviewVideoProps) =>
  project.preview_video ? (
    <video
      aria-label={`${project.title} preview video`}
      className={cn(
        "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
        isVisible ? "opacity-100" : "opacity-0"
      )}
      loop
      muted
      onLoadedData={onLoadedData}
      playsInline
      poster={poster}
      preload="metadata"
      ref={videoRef}
      src={project.preview_video}
    />
  ) : null;
