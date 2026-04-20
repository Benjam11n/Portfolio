"use client";

import { useGSAP } from "@gsap/react";
import gsapCore from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { ExperienceItem } from "@/components/shared/experience-item";
import { SectionCard } from "@/components/shared/section-card";
import { workExperiences } from "@/lib/constants/experience";
import { useAnimationSkipContext } from "@/lib/contexts/animation-skip-context";
import { useShouldSkipEntranceAnimation } from "@/lib/hooks/animation/use-should-skip-entrance-animation";
import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";

gsapCore.registerPlugin(ScrollTrigger);

export const Experience = () => {
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
        gsapCore.set(".experience-item", { autoAlpha: 1, y: 0 });
        return;
      }
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
      dependencies: [
        prefersReducedMotion,
        shouldSkipEntranceAnimation,
        skipAnimations,
      ],
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
