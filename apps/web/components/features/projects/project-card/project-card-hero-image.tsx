import Image from "next/image";

import { PROJECT_CARD_IMAGE_SIZES } from "@/components/features/projects/project-card/constants";
import type { Project } from "@/lib/types";

interface ProjectCardHeroImageProps {
  project: Project;
}

export const ProjectCardHeroImage = ({ project }: ProjectCardHeroImageProps) =>
  project.hero_image ? (
    <Image
      alt={project.title}
      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      fill
      sizes={PROJECT_CARD_IMAGE_SIZES}
      src={project.hero_image}
    />
  ) : null;
