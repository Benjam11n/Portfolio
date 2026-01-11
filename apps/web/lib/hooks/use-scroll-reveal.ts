"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ScrollRevealOptions = {
  y?: number;
  x?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  ease?: string;
  start?: string;
  toggleActions?: string;
};

export const useScrollReveal = (
  containerRef: RefObject<HTMLElement | null>,
  targetSelector: string | string[],
  options: ScrollRevealOptions = {}
) => {
  const {
    y = 30,
    x = 0,
    duration = 0.8,
    delay = 0,
    stagger = 0.1,
    ease = "power3.out",
    start = "top 85%",
    toggleActions = "play none none none",
  } = options;

  useGSAP(
    () => {
      const targets = Array.isArray(targetSelector)
        ? targetSelector.join(", ")
        : targetSelector;

      gsap.set(targets, {
        y,
        x,
        autoAlpha: 0,
      });

      gsap.to(targets, {
        scrollTrigger: {
          trigger: containerRef.current,
          start,
          toggleActions,
        },
        y: 0,
        x: 0,
        autoAlpha: 1,
        duration,
        delay,
        stagger,
        ease,
      });
    },
    { scope: containerRef }
  );
};
