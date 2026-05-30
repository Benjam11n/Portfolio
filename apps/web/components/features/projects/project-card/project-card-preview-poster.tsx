import Image from "next/image";

import { PROJECT_CARD_IMAGE_SIZES } from "@/components/features/projects/project-card/constants";
import { cn } from "@/lib/utils";

interface ProjectCardPreviewPosterProps {
  isPreviewVisible: boolean;
  previewPoster?: string;
}

export const ProjectCardPreviewPoster = ({
  isPreviewVisible,
  previewPoster,
}: ProjectCardPreviewPosterProps) =>
  previewPoster ? (
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
  ) : null;
