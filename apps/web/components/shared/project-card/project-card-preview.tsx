import Image from "next/image";
import type { RefObject } from "react";

import { BorderedImage } from "@/components/shared/bordered-image";
import { PROJECT_CARD_IMAGE_SIZES } from "@/components/shared/project-card/constants";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

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
    {project.hero_image && (
      <Image
        alt={project.title}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        fill
        sizes={PROJECT_CARD_IMAGE_SIZES}
        src={project.hero_image}
      />
    )}

    {shouldLoadPreview && project.preview_video && (
      <video
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
          isPreviewVisible ? "opacity-100" : "opacity-0"
        )}
        loop
        muted
        onLoadedData={onPreviewLoadedData}
        playsInline
        poster={previewPoster}
        preload="metadata"
        ref={previewVideoRef}
        src={project.preview_video}
      />
    )}

    {previewPoster && shouldLoadPreview && (
      <Image
        alt=""
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
          isPreviewVisible ? "opacity-0" : "opacity-100"
        )}
        fill
        sizes={PROJECT_CARD_IMAGE_SIZES}
        src={previewPoster}
      />
    )}

    <div className="absolute inset-0 flex items-center justify-center bg-black/5 transition-colors group-hover:bg-black/20">
      <div className="flex items-center gap-3 rounded-2xl bg-black/10 px-6 py-3 backdrop-blur-md transition-transform duration-500 group-hover:scale-110">
        {project.logo && (
          <BorderedImage
            alt={`${project.title} logo`}
            backgroundColor={project.logoStyle?.backgroundColor}
            colorDark={project.logoStyle?.colorDark}
            colorLight={project.logoStyle?.colorLight}
            containerClassName="h-10 w-10 shrink-0"
            height={32}
            imageClassName="p-1.5 object-contain"
            src={project.logo}
            style={{ transform: "scale(1.5)" }}
            width={32}
          />
        )}
        <span className="font-bold text-2xl text-white tracking-tight drop-shadow-md">
          {mainTitle}
        </span>
      </div>
    </div>
  </div>
);
