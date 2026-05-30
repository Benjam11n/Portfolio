"use client";

import { useMemo, useRef } from "react";

import { ProjectCard } from "@/components/features/projects/project-card";
import { SectionCard } from "@/components/shared/section-card";
import { PROJECTS } from "@/lib/constants/projects";
import { useAnimationSkipContext } from "@/lib/contexts/animation-skip-context";
import { useScrollReveal } from "@/lib/hooks/animation/use-scroll-reveal";
import type { RevealStep } from "@/lib/hooks/animation/use-scroll-reveal";
import { useShouldSkipEntranceAnimation } from "@/lib/hooks/animation/use-should-skip-entrance-animation";

export const Projects = () => {
  const projects = Object.values(PROJECTS);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldSkipEntranceAnimation = useShouldSkipEntranceAnimation();
  const { skipAnimations } = useAnimationSkipContext();
  const revealSteps = useMemo<RevealStep[]>(
    () => [
      {
        from: { autoAlpha: 0, scale: 0.9 },
        target: ".project-card-item",
        to: {
          autoAlpha: 1,
          duration: 0.6,
          ease: "back.out(1.2)",
          scale: 1,
          stagger: 0.1,
        },
      },
    ],
    []
  );
  useScrollReveal(containerRef, revealSteps, {
    skipAnimations: shouldSkipEntranceAnimation || skipAnimations,
    start: "top 80%",
  });

  return (
    <SectionCard id="projects" title="Projects">
      <div className="grid grid-cols-1 gap-4" ref={containerRef}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </SectionCard>
  );
};
