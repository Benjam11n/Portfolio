"use client";

import { useGSAP } from "@gsap/react";
import gsapCore from "gsap";
import Link from "next/link";
import { useRef } from "react";

import { Card3D } from "@/components/effects/card-3d";
import { BorderedImage } from "@/components/shared/bordered-image";
import { Markdown } from "@/components/shared/markdown";
import { ROUTES } from "@/lib/constants/navigation";
import type { Project } from "@/lib/types";
import { getProjectsByTech } from "@/lib/utils/projects-by-tech";

interface RelatedProjectsListProps {
  techName: string;
}

export const RelatedProjectsList = ({ techName }: RelatedProjectsListProps) => {
  const projects = getProjectsByTech(techName);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (projects.length === 0) {
        return;
      }

      gsapCore.set(".related-project-item", {
        autoAlpha: 0,
        y: 20,
      });

      gsapCore.to(".related-project-item", {
        autoAlpha: 1,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1,
        y: 0,
      });
    },
    { dependencies: [projects], scope: containerRef }
  );

  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-primary-foreground/50 border-dashed bg-background/40 p-6">
        <p className="font-medium text-muted-foreground text-sm">
          No projects found using {techName}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4" ref={containerRef}>
      <h3 className="font-bold font-mono text-sm text-muted-foreground uppercase">
        Related Projects
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {projects.map((project: Project) => (
          <Link
            aria-label={`View project: ${project.title}`}
            className="related-project-item group block"
            data-hover-cursor=""
            data-hover-cursor-icon="arrow-up-right"
            data-hover-cursor-label="View project"
            href={ROUTES.PROJECT_DETAIL(project.id)}
            key={project.id}
          >
            <Card3D
              className="rounded-xl border border-border/40"
              containerClassName="h-full"
              glare={false}
              shadow={false}
              variant="subtle"
            >
              <div className="flex h-full items-center gap-4 rounded-xl p-4 text-foreground transition-colors group-hover:bg-background/30">
                {/* Project Logo */}
                {project.logo && (
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
                )}

                {/* Project Info */}
                <div className="flex min-w-0 flex-col">
                  <h4 className="font-semibold text-foreground text-sm leading-tight">
                    {project.title.split(" - ")[0]}
                  </h4>
                  {project.title.split(" - ")[1] && (
                    <p className="mt-1 truncate font-medium text-muted-foreground text-xs">
                      {project.title.split(" - ")[1]}
                    </p>
                  )}
                  {project.description && (
                    <Markdown className="mt-1 line-clamp-2 font-normal text-muted-foreground/80 text-xs">
                      {project.description}
                    </Markdown>
                  )}
                </div>

                {/* Arrow Icon */}
                <div className="ml-auto flex shrink-0 items-center">
                  <svg
                    className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    role="img"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <title>Arrow right icon</title>
                    <path
                      d="M9 5l7 7-7 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
              </div>
            </Card3D>
          </Link>
        ))}
      </div>
    </div>
  );
};
