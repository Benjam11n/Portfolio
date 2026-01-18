"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { ProjectCard } from "@/components/shared/project-card";
import { SectionCard } from "@/components/shared/section-card";
import { PROJECTS } from "@/lib/constants/projects";
import { useAnimationSkipContext } from "@/lib/contexts/animation-skip-context";
import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";

gsap.registerPlugin(ScrollTrigger);

export const Projects = () => {
  const projects = Object.values(PROJECTS);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { skipAnimations } = useAnimationSkipContext();

  useGSAP(
    () => {
      /**
       * PROJECTS ANIMATION TIMELINE
       * ===========================
       * Total Duration: Variable (depends on number of projects)
       * Trigger: Scroll-based (starts when section reaches 80% viewport)
       *
       * Breakdown (for N projects):
       * Each card: 0.6s duration with 0.1s stagger
       * Total: 0.6s + (N-1) × 0.1s
       *
       * Example (5 projects): 0.6s + 0.4s = 1.0s total
       *
       * Strategy: Gentle scale-up with back easing for a premium feel.
       * Staggered reveal creates a cascading showcase effect.
       */

      // Skip all animations if user prefers reduced motion or if animations were skipped
      if (prefersReducedMotion || skipAnimations) {
        // Set all elements to their final state instantly
        gsap.set(".project-card-item", {
          scale: 1,
          autoAlpha: 1,
        });
        return;
      }

      /**
       * PROJECT CARD REVEAL ANIMATION
       * =============================
       * Purpose: Showcases the project portfolio with a sophisticated, staggered reveal.
       *   The gentle scale-up from 0.9 to 1.0 with back easing creates a premium,
       *   professional presentation that encourages exploration of each project.
       *
       * Duration: 0.6s per card with 0.1s stagger between cards.
       *   The moderate duration feels substantial without being sluggish. The back
       *   easing (1.2) adds a subtle overshoot that makes the cards feel tactile
       *   and responsive. Starting from 0.9 scale (not 0) creates a more refined,
       *   less dramatic entrance suitable for professional content.
       *
       * Skipping: When animations are skipped, all project cards instantly appear
       *   at their final state (scale: 1, fully visible). Users can immediately
       *   browse the portfolio without waiting for the staggered animation.
       */
      gsap.set(".project-card-item", { autoAlpha: 0, scale: 0.9 });

      gsap.to(".project-card-item", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        scale: 1,
        autoAlpha: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.2)",
      });
    },
    {
      scope: containerRef,
      dependencies: [prefersReducedMotion, skipAnimations],
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
