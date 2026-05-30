import { BorderedImage } from "@/components/shared/bordered-image";
import type { Project } from "@/lib/types";

interface RelatedProjectCardLogoProps {
  project: Project;
}

export const RelatedProjectCardLogo = ({
  project,
}: RelatedProjectCardLogoProps) =>
  project.logo ? (
    <BorderedImage
      alt={`${project.title} logo`}
      backgroundColor={project.logoStyle?.backgroundColor}
      colorDark={project.logoStyle?.colorDark}
      colorLight={project.logoStyle?.colorLight}
      containerClassName="h-12 w-12 shrink-0"
      height={48}
      imageClassName="p-1.5 object-contain"
      src={project.logo}
      style={{ transform: "scale(1.5)" }}
      width={48}
    />
  ) : null;
