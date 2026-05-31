"use client";

import { useRef } from "react";
import type { ReactNode } from "react";

import { useAnimationSkipContext } from "@/lib/contexts/animation-skip-context";
import { useScrollReveal } from "@/lib/hooks/animation/use-scroll-reveal";
import { useShouldSkipEntranceAnimation } from "@/lib/hooks/animation/use-should-skip-entrance-animation";

interface ExperienceRevealProps {
  children: ReactNode;
}

export const ExperienceReveal = ({ children }: ExperienceRevealProps) => {
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
    <div className="flex flex-col gap-4" ref={containerRef}>
      {children}
    </div>
  );
};
