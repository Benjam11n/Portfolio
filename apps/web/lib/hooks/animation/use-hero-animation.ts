"use client";

import { useGSAP } from "@gsap/react";
import gsapCore from "gsap";
import type { RefObject } from "react";

import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  ANIMATION_STAGGER,
} from "@/lib/constants/animation";
import { useAnimationPerformance } from "@/lib/hooks/animation/use-animation-performance";

interface UseHeroAnimationOptions {
  buttonsRef: RefObject<HTMLDivElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  imageRef: RefObject<HTMLDivElement | null>;
  prefersReducedMotion: boolean;
  shouldSkipEntranceAnimation: boolean;
  skipAnimations: boolean;
}

const logHeroMetrics = (
  label: string,
  metrics: ReturnType<typeof useAnimationPerformance>,
  duration: number
) => {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  console.log(label, {
    duration: `${duration.toFixed(2)}ms`,
    fps: metrics.fps,
    frameDrops: metrics.frameDrops,
    frameTime: metrics.frameTime,
  });

  if (metrics.fps < 30) {
    console.warn("[Hero] Poor FPS detected:", metrics.fps);
  }

  if (metrics.frameTime > 33) {
    console.warn("[Hero] High frame time detected:", `${metrics.frameTime}ms`);
  }
};

export const useHeroAnimation = ({
  buttonsRef,
  containerRef,
  imageRef,
  prefersReducedMotion,
  shouldSkipEntranceAnimation,
  skipAnimations,
}: UseHeroAnimationOptions) => {
  const performanceMetrics = useAnimationPerformance();

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
          const offset = isDesktop ? 0 : -40;
          const shouldSkip =
            prefersReducedMotion ||
            skipAnimations ||
            shouldSkipEntranceAnimation;

          performanceMetrics.startTracking();

          if (shouldSkip) {
            gsapCore.set(imageRef.current, {
              autoAlpha: 1,
              rotate: 0,
              scale: 1,
              x: isDesktop ? 0 : offset,
            });
            gsapCore.set(".char", { autoAlpha: 1, y: 0 });
            gsapCore.set(".hero-badge", { autoAlpha: 1, scale: 1 });
            gsapCore.set(".hero-text", { autoAlpha: 1, y: 0 });
            gsapCore.set(buttonsRef.current?.children || [], {
              autoAlpha: 1,
              y: 0,
            });

            logHeroMetrics(
              "[Hero] Animations skipped - Performance metrics:",
              performanceMetrics,
              performanceMetrics.stopTracking()
            );
            return;
          }

          const timeline = gsapCore.timeline({
            defaults: { ease: ANIMATION_EASING.DEFAULT },
            onComplete: () => {
              logHeroMetrics(
                "[Hero] Animation complete - Performance metrics:",
                performanceMetrics,
                performanceMetrics.stopTracking()
              );
            },
          });

          timeline
            .fromTo(
              imageRef.current,
              {
                autoAlpha: 0,
                rotate: -15,
                scale: 0,
                x: offset,
              },
              {
                autoAlpha: 1,
                duration: ANIMATION_DURATION.MEDIUM_FAST / 1000,
                ease: ANIMATION_EASING.ELASTIC,
                rotate: 0,
                scale: 1,
                x: 0,
              }
            )
            .to(
              ".char",
              {
                autoAlpha: 1,
                duration: ANIMATION_DURATION.MEDIUM_FAST / 1000,
                ease: ANIMATION_EASING.DEFAULT,
                stagger: ANIMATION_STAGGER.QUICK,
                y: 0,
              },
              `-=${ANIMATION_DURATION.MEDIUM_FAST / 1000 - 0.1}`
            )
            .fromTo(
              ".hero-badge",
              { autoAlpha: 0, scale: 0 },
              {
                autoAlpha: 1,
                duration: ANIMATION_DURATION.QUICK / 1000,
                ease: ANIMATION_EASING.BACK_STRONG,
                scale: 1,
              },
              `-=${ANIMATION_DURATION.MEDIUM_FAST / 1000 - 0.05}`
            )
            .fromTo(
              ".hero-text",
              {
                autoAlpha: 0,
                y: 40,
              },
              {
                autoAlpha: 1,
                duration: ANIMATION_DURATION.MEDIUM_FAST / 1000,
                ease: ANIMATION_EASING.DEFAULT,
                stagger: ANIMATION_STAGGER.QUICK,
                y: 0,
              },
              `-=${ANIMATION_DURATION.MEDIUM_FAST / 1000}`
            )
            .fromTo(
              buttonsRef.current?.children || [],
              {
                autoAlpha: 0,
                y: 20,
              },
              {
                autoAlpha: 1,
                duration: ANIMATION_DURATION.MEDIUM_FAST / 1000,
                ease: ANIMATION_EASING.POWER3,
                stagger: ANIMATION_STAGGER.QUICK,
                y: 0,
              },
              `-=${ANIMATION_DURATION.MEDIUM_FAST / 1000}`
            );
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
