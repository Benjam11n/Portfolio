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

  useGSAP(
    () => {
      const shouldSkip = prefersReducedMotion || skipAnimations;

      if (!isRevealTimeline(targetSelector)) {
        const targets = getTargets(targetSelector);

        if (shouldSkip) {
          gsapCore.set(targets, {
            autoAlpha: 1,
            x: 0,
            y: 0,
          });
          return;
        }

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
        return;
      }

      if (shouldSkip) {
        for (const step of targetSelector) {
          gsapCore.set(getTargets(step.target), {
            autoAlpha: 1,
            ...getFinalVars(step.to),
          });
        }
        return;
      }

      for (const step of targetSelector) {
        if (step.from) {
          gsapCore.set(getTargets(step.target), step.from);
        }
      }

      const timeline = gsapCore.timeline({
        defaults: { ease },
        scrollTrigger: {
          start,
          toggleActions,
          trigger: containerRef.current,
        },
      });

      for (const step of targetSelector) {
        timeline.to(getTargets(step.target), step.to, step.position);
      }
    },
    {
      dependencies: [prefersReducedMotion, skipAnimations],
      scope: containerRef,
    }
  );
};
