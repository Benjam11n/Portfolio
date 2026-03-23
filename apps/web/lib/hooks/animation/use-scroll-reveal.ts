"use client";

import { useGSAP } from "@gsap/react";
import gsapCore from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";

import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";

if (typeof window !== "undefined") {
  gsapCore.registerPlugin(ScrollTrigger);
}

interface ScrollRevealOptions {
  y?: number;
  x?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  ease?: string;
  start?: string;
  toggleActions?: string;
  skipAnimations?: boolean;
}

export const useScrollReveal = (
  containerRef: RefObject<HTMLElement | null>,
  targetSelector: string | string[],
  options: ScrollRevealOptions = {}
) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const {
    y = 30,
    x = 0,
    duration = 0.8,
    delay = 0,
    stagger = 0.1,
    ease = "power3.out",
    start = "top 85%",
    toggleActions = "play none none none",
    skipAnimations = false,
  } = options;

  useGSAP(
    () => {
      const targets = Array.isArray(targetSelector)
        ? targetSelector.join(", ")
        : targetSelector;

      if (prefersReducedMotion || skipAnimations) {
        // For reduced motion or skipped animations, immediately set to final state without animation
        gsapCore.set(targets, {
          autoAlpha: 1,
          x: 0,
          y: 0,
        });
      } else {
        // Animate from offset position
        gsapCore.set(targets, {
          autoAlpha: 0,
          x,
          y,
        });

        gsapCore.to(targets, {
          autoAlpha: 1,
          delay,
          duration,
          ease,
          scrollTrigger: {
            start,
            toggleActions,
            trigger: containerRef.current,
          },
          stagger,
          x: 0,
          y: 0,
        });
      }
    },
    {
      dependencies: [prefersReducedMotion, skipAnimations],
      scope: containerRef,
    }
  );
};
