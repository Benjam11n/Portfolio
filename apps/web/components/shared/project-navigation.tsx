import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { BorderedImage } from "@/components/shared/bordered-image";
import { ROUTES } from "@/lib/constants/navigation";
import { PROJECTS } from "@/lib/constants/projects";

export const ProjectNavigation = ({ currentId }: { currentId: string }) => {
  const currentIndex = PROJECTS.findIndex((p) => p.id === currentId);
  const nextProjectIndex = (currentIndex + 1) % PROJECTS.length;
  const nextProject = PROJECTS[nextProjectIndex];

  if (!nextProject) {
    return null;
  }

  return (
    <div className="mt-10 flex justify-end border-border/10 border-t">
      <Link
        className="group flex flex-col items-end gap-1"
        href={ROUTES.PROJECT_DETAIL(nextProject.id)}
      >
        <div className="flex items-center gap-2 font-bold text-foreground text-md transition-colors hover:underline group-hover:text-muted-foreground">
          <BorderedImage
            alt={`${nextProject.title} logo`}
            backgroundColor={nextProject.logoStyle?.backgroundColor}
            colorDark={nextProject.logoStyle?.colorDark}
            colorLight={nextProject.logoStyle?.colorLight}
            containerClassName="h-8 w-8 shrink-0"
            height={20}
            imageClassName="p-1.5 object-contain"
            src={nextProject.logo}
            style={{ transform: "scale(1.5)" }}
            width={20}
          />
          <span>{nextProject.title.split(" - ")[0]}</span>
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    </div>
  );
};
