"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

import { PROJECT_HERO_IMAGE_SIZES } from "@/components/features/projects/project-hero/constants";
import type { Project } from "@/lib/types";

interface ProjectHeroVisualProps {
  project: Project;
}

export const ProjectHeroVisual = ({ project }: ProjectHeroVisualProps) => {
  const [heroImageError, setHeroImageError] = useState(false);
  const handleHeroImageError = useCallback(() => {
    setHeroImageError(true);
  }, []);

  if (!project.hero_image) {
    return null;
  }

  return (
    <div className="hero-visual group w-full overflow-hidden rounded-2xl border border-border/50 bg-secondary shadow-lg">
      <div className="relative aspect-video w-full">
        {heroImageError ? (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            Hero image not available
          </div>
        ) : (
          <Image
            alt={`${project.title} hero`}
            className="object-cover"
            fill
            onError={handleHeroImageError}
            priority
            sizes={PROJECT_HERO_IMAGE_SIZES}
            src={project.hero_image}
          />
        )}
      </div>
    </div>
  );
};
