"use client";

import { useGSAP } from "@gsap/react";
import gsapCore from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { ExperienceItem } from "@/components/shared/experience-item";
import { SectionCard } from "@/components/shared/section-card";
import { workExperiences } from "@/lib/constants/experience";
import { useAnimationSkipContext } from "@/lib/contexts/animation-skip-context";
import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";

gsapCore.registerPlugin(ScrollTrigger);

export const Experience = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { skipAnimations } = useAnimationSkipContext();

  useGSAP(
    () => {
      /**
       * EXPERIENCE ANIMATION TIMELINE
       * =============================
       * Total Duration: Variable (depends on number of positions)
       * Trigger: Scroll-based (starts when section reaches 80% viewport)
       *
       * Breakdown (for N positions):
       * Each item: 0.5s duration with 0.15s stagger
       * Total: 0.5s + (N-1) × 0.15s
       *
       * Example (4 positions): 0.5s + 0.45s = 0.95s total
       *
       * Strategy: Clean slide-up reveal with power3 easing for professional progression.
       * Larger stagger (0.15s) emphasizes each career milestone.
       */

      // Skip all animations if user prefers reduced motion or if animations were skipped
      if (prefersReducedMotion || skipAnimations) {
        // Set all experience items to their final state instantly
        gsapCore.set(".experience-item", { autoAlpha: 1, y: 0 });
        return;
      }

      /**
       * EXPERIENCE ITEM REVEAL ANIMATION
       * ================================
       * Purpose: Presents career progression with a clean, professional slide-up effect.
       *   The upward movement from 30px below creates a sense of forward momentum
       *   and professional growth, while the fade-in ensures readability throughout.
       *
       * Duration: 0.5s per item with 0.15s stagger between items.
       *   The relatively quick duration keeps the animation feeling snappy and efficient.
       *   The larger stagger (0.15s vs typical 0.1s) gives each career position its
       *   moment of focus, emphasizing the importance of each professional milestone.
       *   Power3.out easing provides smooth deceleration that feels natural and polished.
       *
       * Skipping: When animations are skipped, all experience items instantly appear
       *   in their final position (y: 0, fully visible). Users can immediately review
       *   the career history without waiting for the staggered reveal.
       */
      gsapCore.set(".experience-item", { autoAlpha: 0, y: 30 });

      gsapCore.to(".experience-item", {
        autoAlpha: 1,
        duration: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          start: "top 80%",
          toggleActions: "play none none none",
          trigger: containerRef.current,
        },
        stagger: 0.15,
        y: 0,
      });
    },
    {
      dependencies: [prefersReducedMotion, skipAnimations],
      scope: containerRef,
    }
  );

  return (
    <SectionCard id="experience" title="Experience">
      <div className="flex flex-col gap-4" ref={containerRef}>
        {workExperiences.map((item) => (
          <div className="experience-item" key={item.id}>
            <ExperienceItem item={item} />
          </div>
        ))}
      </div>
    </SectionCard>
  );
};
