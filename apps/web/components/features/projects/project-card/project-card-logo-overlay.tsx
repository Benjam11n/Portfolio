import { BorderedImage } from "@/components/shared/bordered-image";
import type { Project } from "@/lib/types";

interface ProjectCardLogoOverlayProps {
  mainTitle: string;
  project: Project;
}

export const ProjectCardLogoOverlay = ({
  mainTitle,
  project,
}: ProjectCardLogoOverlayProps) => (
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
);
