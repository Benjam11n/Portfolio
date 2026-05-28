import { PROJECT_HERO_LOGO_SIZE } from "@/app/projects/[id]/_components/project-hero/constants";
import { BorderedImage } from "@/components/shared/bordered-image";
import type { Project } from "@/lib/types";

interface ProjectHeroHeadingProps {
  project: Project;
  title: string;
}

export const ProjectHeroHeading = ({
  project,
  title,
}: ProjectHeroHeadingProps) => (
  <div className="mb-4 flex items-center gap-4">
    {project.logo && (
      <BorderedImage
        alt={`${project.title} logo`}
        backgroundColor={project.logoStyle?.backgroundColor}
        colorDark={project.logoStyle?.colorDark}
        colorLight={project.logoStyle?.colorLight}
        containerClassName="hero-logo h-12 w-12 shrink-0"
        height={PROJECT_HERO_LOGO_SIZE}
        imageClassName="p-2 object-contain"
        src={project.logo}
        style={{ transform: "scale(1.5)" }}
        width={PROJECT_HERO_LOGO_SIZE}
      />
    )}
    <h1 className="hero-title text-balance font-bold text-3xl tracking-tight sm:text-4xl">
      {title}
    </h1>
  </div>
);
