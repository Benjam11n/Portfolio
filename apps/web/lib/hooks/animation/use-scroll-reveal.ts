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

type RevealTarget = string | string[];
type RevealVars = gsap.TweenVars;

export interface RevealStep {
  from?: RevealVars;
  position?: gsap.Position;
  target: RevealTarget;
  to: RevealVars;
}

const isRevealTimeline = (
  targetSelector: RevealTarget | RevealStep[]
): targetSelector is RevealStep[] =>
  Array.isArray(targetSelector) &&
  targetSelector.every((step) => typeof step === "object" && "target" in step);

const getTargets = (target: RevealTarget) =>
  Array.isArray(target) ? target.join(", ") : target;

const getFinalVars = (vars: RevealVars): RevealVars => {
  const {
    delay: _delay,
    duration: _duration,
    ease: _ease,
    scrollTrigger: _scrollTrigger,
    stagger: _stagger,
    ...finalVars
  } = vars;

  return finalVars;
};

const getScrollTrigger = (
  containerRef: RefObject<HTMLElement | null>,
  options: Required<Pick<ScrollRevealOptions, "start" | "toggleActions">>
) => ({
  start: options.start,
  toggleActions: options.toggleActions,
  trigger: containerRef.current,
});

const showTargets = (target: RevealTarget) => {
  gsapCore.set(getTargets(target), {
    autoAlpha: 1,
    x: 0,
    y: 0,
  });
};

const revealTargets = (
  containerRef: RefObject<HTMLElement | null>,
  target: RevealTarget,
  options: Required<ScrollRevealOptions>
) => {
  const targets = getTargets(target);

  gsapCore.set(targets, {
    autoAlpha: 0,
    x: options.x,
    y: options.y,
  });

  gsapCore.to(targets, {
    autoAlpha: 1,
    delay: options.delay,
    duration: options.duration,
    ease: options.ease,
    scrollTrigger: getScrollTrigger(containerRef, options),
    stagger: options.stagger,
    x: 0,
    y: 0,
  });
};

const showTimeline = (steps: RevealStep[]) => {
  for (const step of steps) {
    gsapCore.set(getTargets(step.target), {
      autoAlpha: 1,
      ...getFinalVars(step.to),
    });
  }
};

const revealTimeline = (
  containerRef: RefObject<HTMLElement | null>,
  steps: RevealStep[],
  options: Required<ScrollRevealOptions>
) => {
  for (const step of steps) {
    if (step.from) {
      gsapCore.set(getTargets(step.target), step.from);
    }
  }

  const timeline = gsapCore.timeline({
    defaults: { ease: options.ease },
    scrollTrigger: getScrollTrigger(containerRef, options),
  });

  for (const step of steps) {
    timeline.to(getTargets(step.target), step.to, step.position);
  }
};

export const useScrollReveal = (
  containerRef: RefObject<HTMLElement | null>,
  targetSelector: RevealTarget | RevealStep[],
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
  const revealOptions = {
    delay,
    duration,
    ease,
    skipAnimations,
    stagger,
    start,
    toggleActions,
    x,
    y,
  };

  useGSAP(
    () => {
      const shouldSkip = prefersReducedMotion || skipAnimations;

      if (!isRevealTimeline(targetSelector)) {
        if (shouldSkip) {
          showTargets(targetSelector);
          return;
        }

        revealTargets(containerRef, targetSelector, revealOptions);
        return;
      }

      if (shouldSkip) {
        showTimeline(targetSelector);
        return;
      }

      revealTimeline(containerRef, targetSelector, revealOptions);
    },
    {
      dependencies: [prefersReducedMotion, skipAnimations],
      scope: containerRef,
    }
  );
};
