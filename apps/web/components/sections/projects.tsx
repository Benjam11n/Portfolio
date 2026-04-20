"use client";

import { useGSAP } from "@gsap/react";
import gsapCore from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { ProjectCard } from "@/components/shared/project-card";
import { SectionCard } from "@/components/shared/section-card";
import { PROJECTS } from "@/lib/constants/projects";
import { useAnimationSkipContext } from "@/lib/contexts/animation-skip-context";
import { useShouldSkipEntranceAnimation } from "@/lib/hooks/animation/use-should-skip-entrance-animation";
import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";

gsapCore.registerPlugin(ScrollTrigger);

export const Projects = () => {
  const projects = Object.values(PROJECTS);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldSkipEntranceAnimation = useShouldSkipEntranceAnimation();
  const { skipAnimations } = useAnimationSkipContext();

  useGSAP(
    () => {
      if (
        prefersReducedMotion ||
        shouldSkipEntranceAnimation ||
        skipAnimations
      ) {
        gsapCore.set(".project-card-item", {
          autoAlpha: 1,
          scale: 1,
        });
        return;
      }
      gsapCore.set(".project-card-item", { autoAlpha: 0, scale: 0.9 });

      gsapCore.to(".project-card-item", {
        autoAlpha: 1,
        duration: 0.6,
        ease: "back.out(1.2)",
        scale: 1,
        scrollTrigger: {
          start: "top 80%",
          toggleActions: "play none none none",
          trigger: containerRef.current,
        },
        stagger: 0.1,
      });
    },
    {
      dependencies: [
        prefersReducedMotion,
        shouldSkipEntranceAnimation,
        skipAnimations,
      ],
      scope: containerRef,
    }
  );

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
