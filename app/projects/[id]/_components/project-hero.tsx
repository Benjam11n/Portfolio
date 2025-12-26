import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ShiftButton } from "@/components/shift-button";
import type { Project } from "@/constants";

type ProjectHeroProps = {
  project: Project;
};

export const ProjectHero = ({ project }: ProjectHeroProps) => {
  return (
    <div className="w-full">
      {/* Back Button */}
      <Link
        className="group mb-8 inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-black"
        href="/#projects"
      >
        <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
      </Link>

      {/* Header Section */}
      <div className="mb-12">
        <h1 className="mb-4 font-bold text-lg tracking-tight sm:text-5xl md:text-xl">
          {project.title.split(" - ")[0]}
        </h1>
        <p className="mb-8 max-w-md text-muted-foreground text-sm leading-relaxed md:text-lg">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-4">
          {project.href && (
            <ShiftButton
              href={project.href}
              rel="noopener noreferrer"
              target="_blank"
            >
              Live Site
            </ShiftButton>
          )}

          {project.github && (
            <ShiftButton
              href={project.github}
              rel="noopener noreferrer"
              target="_blank"
              variant="secondary"
            >
              Source Code
            </ShiftButton>
          )}
        </div>
      </div>
    </div>
  );
};
