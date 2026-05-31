"use client";

import { useGSAP } from "@gsap/react";
import gsapCore from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";

import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  ANIMATION_STAGGER,
} from "@/lib/constants/animation";

if (typeof window !== "undefined") {
  gsapCore.registerPlugin(ScrollTrigger);
}

interface UseAboutAnimationOptions {
  containerRef: RefObject<HTMLDivElement | null>;
  prefersReducedMotion: boolean;
  shouldSkipEntranceAnimation: boolean;
  skipAnimations: boolean;
}

const imageRotation = (index: number) => (index === 0 ? -6 : 3);
const imageStartRotation = (index: number) => (index === 0 ? -15 : 15);

const showAboutContent = () => {
  gsapCore.set(".about-image-wrapper", {
    autoAlpha: 1,
    rotate: imageRotation,
    scale: 1,
  });
  gsapCore.set([".about-text", ".about-button"], {
    autoAlpha: 1,
    scale: 1,
    x: 0,
    y: 0,
  });
};

const animateAboutContent = (
  containerRef: RefObject<HTMLDivElement | null>,
  isDesktop: boolean
) => {
  gsapCore
    .timeline({
      defaults: { ease: ANIMATION_EASING.DEFAULT },
      scrollTrigger: {
        start: "top 80%",
        toggleActions: "play none none none",
        trigger: containerRef.current,
      },
    })
    .fromTo(
      ".about-image-wrapper",
      { autoAlpha: 0, rotate: imageStartRotation, scale: 0 },
      {
        autoAlpha: 1,
        duration: ANIMATION_DURATION.LONG / 1000,
        ease: ANIMATION_EASING.ELASTIC,
        rotate: imageRotation,
        scale: 1,
        stagger: ANIMATION_STAGGER.SLOW,
      }
    )
    .fromTo(
      ".about-text",
      { autoAlpha: 0, y: 30 },
      {
        autoAlpha: 1,
        duration: ANIMATION_DURATION.MEDIUM_SLOW / 1000,
        stagger: ANIMATION_STAGGER.STANDARD,
        y: 0,
      },
      `-=${ANIMATION_DURATION.LONG / 1000}`
    )
    .fromTo(
      ".about-button",
      { autoAlpha: 0, scale: 0, x: isDesktop ? -220 : -40 },
      {
        autoAlpha: 1,
        duration: ANIMATION_DURATION.STANDARD / 1000,
        ease: ANIMATION_EASING.BACK_MEDIUM,
        scale: 1,
        x: 0,
      },
      `-=${ANIMATION_DURATION.MEDIUM_FAST / 1000}`
    );
};

const animateAboutParallax = (
  containerRef: RefObject<HTMLDivElement | null>
) => {
  gsapCore.to(".about-image", {
    ease: ANIMATION_EASING.NONE,
    scrollTrigger: {
      end: "bottom top",
      scrub: true,
      start: "top bottom",
      trigger: containerRef.current,
    },
    yPercent: -10,
  });
};

export const useAboutAnimation = ({
  containerRef,
  prefersReducedMotion,
  shouldSkipEntranceAnimation,
  skipAnimations,
}: UseAboutAnimationOptions) => {
  useGSAP(
    () => {
      const mm = gsapCore.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const { isDesktop } = context.conditions as { isDesktop: boolean };

          if (
            prefersReducedMotion ||
            shouldSkipEntranceAnimation ||
            skipAnimations
          ) {
            showAboutContent();
            return;
          }

          animateAboutContent(containerRef, isDesktop);
          animateAboutParallax(containerRef);
        }
      );
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
};
