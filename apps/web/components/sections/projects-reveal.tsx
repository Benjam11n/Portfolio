"use client";

import { useRef } from "react";
import type { ReactNode } from "react";

import { useAnimationSkipContext } from "@/lib/contexts/animation-skip-context";
import { useScrollReveal } from "@/lib/hooks/animation/use-scroll-reveal";
import type { RevealStep } from "@/lib/hooks/animation/use-scroll-reveal";
import { useShouldSkipEntranceAnimation } from "@/lib/hooks/animation/use-should-skip-entrance-animation";

interface ProjectsRevealProps {
  children: ReactNode;
}

const PROJECT_REVEAL_STEPS: RevealStep[] = [
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
];

export const ProjectsReveal = ({ children }: ProjectsRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldSkipEntranceAnimation = useShouldSkipEntranceAnimation();
  const { skipAnimations } = useAnimationSkipContext();

  useScrollReveal(containerRef, PROJECT_REVEAL_STEPS, {
    skipAnimations: shouldSkipEntranceAnimation || skipAnimations,
    start: "top 80%",
  });

  return (
    <div className="grid grid-cols-1 gap-4" ref={containerRef}>
      {children}
    </div>
  );
};
