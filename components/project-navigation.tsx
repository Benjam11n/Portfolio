import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { PROJECTS } from "@/constants";

export function ProjectNavigation({ currentId }: { currentId: string }) {
  const projectIds = Object.keys(PROJECTS);
  const currentIndex = projectIds.indexOf(currentId);
  const nextProjectIndex = (currentIndex + 1) % projectIds.length;
  const nextProjectId = projectIds[nextProjectIndex];
  const nextProject = PROJECTS[nextProjectId];

  if (!nextProject) {
    return null;
  }

  return (
    <div className="mt-10 flex justify-end border-border/10 border-t">
      <Link
        className="group flex flex-col items-end gap-1"
        href={`/projects/${nextProjectId}`}
      >
        <div className="flex items-center gap-2 font-bold text-foreground text-md transition-colors hover:underline group-hover:text-muted-foreground">
          <span>{nextProject.title.split(" - ")[0]}</span>
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    </div>
  );
}
