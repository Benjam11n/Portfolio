"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Markdown } from "@/components/shared/markdown";
import { ROUTES } from "@/lib/constants/navigation";
import type { Project } from "@/lib/types";
import { getProjectsByTech } from "@/lib/utils/projects-by-tech";

type RelatedProjectsListProps = {
  techName: string;
};

export const RelatedProjectsList = ({ techName }: RelatedProjectsListProps) => {
  const projects = getProjectsByTech(techName);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (projects.length === 0) {
        return;
      }

      gsap.set(".related-project-item", {
        y: 20,
        autoAlpha: 0,
      });

      gsap.to(".related-project-item", {
        y: 0,
        autoAlpha: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      });
    },
    { scope: containerRef, dependencies: [projects] }
  );

  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-border/60 border-dashed bg-card/50 p-8">
        <p className="font-medium text-muted-foreground text-sm">
          No projects found using {techName}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4" ref={containerRef}>
      <h3 className="font-bold font-mono text-muted-foreground text-xs uppercase tracking-widest">
        Related Projects
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {projects.map((project: Project) => (
          <Link
            aria-label={`View project: ${project.title}`}
            className="related-project-item group block"
            href={ROUTES.PROJECT_DETAIL(project.id)}
            key={project.id}
          >
            <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-4 shadow-sm transition-all hover:border-border/80 hover:shadow-md">
              {/* Project Logo */}
              {project.logo && (
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border-4 border-white shadow-lg dark:border-black"
                  style={project.logoStyle}
                >
                  <Image
                    alt={`${project.title} logo`}
                    className="h-full w-full object-contain p-1.5"
                    height={48}
                    src={project.logo}
                    width={48}
                  />
                </div>
              )}

              {/* Project Info */}
              <div className="flex min-w-0 flex-col">
                <h4 className="font-semibold text-foreground text-sm leading-tight transition-colors group-hover:text-primary">
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
                  className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
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
          </Link>
        ))}
      </div>
    </div>
  );
};
