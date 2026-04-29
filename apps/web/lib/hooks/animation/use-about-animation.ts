"use client";

import { useGSAP } from "@gsap/react";
import gsapCore from "gsap";
import type { RefObject } from "react";

import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  ANIMATION_STAGGER,
} from "@/lib/constants/animation";

interface UseAboutAnimationOptions {
  containerRef: RefObject<HTMLDivElement | null>;
  prefersReducedMotion: boolean;
  shouldSkipEntranceAnimation: boolean;
  skipAnimations: boolean;
}

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
          const offset = isDesktop ? -220 : -40;
          const shouldSkip =
            prefersReducedMotion ||
            shouldSkipEntranceAnimation ||
            skipAnimations;

          if (shouldSkip) {
            gsapCore.set(".about-image-wrapper", {
              autoAlpha: 1,
              rotate: (index: number) => (index === 0 ? -6 : 3),
              scale: 1,
            });
            gsapCore.set(".about-text", { autoAlpha: 1, y: 0 });
            gsapCore.set(".about-button", { autoAlpha: 1, scale: 1, x: 0 });
            return;
          }

          const timeline = gsapCore.timeline({
            defaults: { ease: ANIMATION_EASING.DEFAULT },
            scrollTrigger: {
              start: "top 80%",
              toggleActions: "play none none none",
              trigger: containerRef.current,
            },
          });

          timeline
            .fromTo(
              ".about-image-wrapper",
              {
                autoAlpha: 0,
                rotate: (index: number) => (index === 0 ? -15 : 15),
                scale: 0,
              },
              {
                autoAlpha: 1,
                duration: ANIMATION_DURATION.LONG / 1000,
                ease: ANIMATION_EASING.ELASTIC,
                rotate: (index: number) => (index === 0 ? -6 : 3),
                scale: 1,
                stagger: ANIMATION_STAGGER.SLOW,
              }
            )
            .fromTo(
              ".about-text",
              {
                autoAlpha: 0,
                y: 30,
              },
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
              {
                autoAlpha: 0,
                scale: 0,
                x: offset,
              },
              {
                autoAlpha: 1,
                duration: ANIMATION_DURATION.STANDARD / 1000,
                ease: ANIMATION_EASING.BACK_MEDIUM,
                scale: 1,
                x: 0,
              },
              `-=${ANIMATION_DURATION.MEDIUM_FAST / 1000}`
            );

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
