"use client";

import { useGSAP } from "@gsap/react";
import gsapCore from "gsap";
import { useRef } from "react";

import { RelatedProjectCard } from "@/components/features/projects/related-projects-list/related-project-card";
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
          <RelatedProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};
