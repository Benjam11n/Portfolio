"use client";

import { useRef } from "react";

import { ExperienceItem } from "@/components/features/experience/experience-item";
import { SectionCard } from "@/components/shared/section-card";
import { workExperiences } from "@/lib/constants/experience";
import { useAnimationSkipContext } from "@/lib/contexts/animation-skip-context";
import { useScrollReveal } from "@/lib/hooks/animation/use-scroll-reveal";
import { useShouldSkipEntranceAnimation } from "@/lib/hooks/animation/use-should-skip-entrance-animation";

export const Experience = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldSkipEntranceAnimation = useShouldSkipEntranceAnimation();
  const { skipAnimations } = useAnimationSkipContext();
  useScrollReveal(containerRef, ".experience-item", {
    duration: 0.5,
    skipAnimations: shouldSkipEntranceAnimation || skipAnimations,
    stagger: 0.15,
    start: "top 80%",
    y: 30,
  });

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
