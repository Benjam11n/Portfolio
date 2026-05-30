"use client";

import { useMemo, useRef } from "react";

import { ProjectFeatureList } from "@/components/features/projects/project-overview/project-feature-list";
import { ProjectTechStack } from "@/components/features/projects/project-overview/project-tech-stack";
import { Markdown } from "@/components/shared/markdown";
import { useScrollReveal } from "@/lib/hooks/animation/use-scroll-reveal";
import type { RevealStep } from "@/lib/hooks/animation/use-scroll-reveal";
import type { Project } from "@/lib/types/index";

interface ProjectOverviewProps {
  project: Project;
}

export const ProjectOverview = ({ project }: ProjectOverviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const normalizedFeatures =
    project.features?.length && project.features.length % 2 === 1
      ? project.features.slice(0, -1)
      : (project.features ?? []);

  const revealSteps = useMemo<RevealStep[]>(
    () => [
      {
        from: { autoAlpha: 0, y: 20 },
        target: ".overview-text",
        to: { autoAlpha: 1, duration: 0.8, y: 0 },
      },
      {
        from: { autoAlpha: 0, scale: 0.98, y: 16 },
        position: "-=0.4",
        target: ".feature-card",
        to: {
          autoAlpha: 1,
          duration: 0.7,
          scale: 1,
          stagger: 0.08,
          y: 0,
        },
      },
      {
        from: { autoAlpha: 0, scale: 0.8 },
        position: "-=0.4",
        target: ".tech-item",
        to: { autoAlpha: 1, duration: 0.5, scale: 1, stagger: 0.05 },
      },
    ],
    []
  );
  useScrollReveal(containerRef, revealSteps);

  return (
    <div className="flex flex-col gap-8" ref={containerRef}>
      {/* Row 1: Overview and Description */}
      <div className="space-y-4">
        <div className="overview-text max-w-2xl text-lg text-muted-foreground leading-relaxed">
          <Markdown>{project.subdesc || ""}</Markdown>
        </div>
      </div>

      <ProjectFeatureList features={normalizedFeatures} />
      <ProjectTechStack techStack={project.techStack} />
    </div>
  );
};
