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
  shouldReduceMotion: boolean;
  shouldSkipEntranceAnimation: boolean;
  skipAnimations: boolean;
}

type AnimationMetrics = ReturnType<typeof useAnimationPerformance>;

const logHeroMetrics = (
  label: string,
  metrics: AnimationMetrics,
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

const mediumFastSeconds = ANIMATION_DURATION.MEDIUM_FAST / 1000;
const quickSeconds = ANIMATION_DURATION.QUICK / 1000;

const shouldUseStaticHeroState = ({
  shouldReduceMotion,
  shouldSkipEntranceAnimation,
  skipAnimations,
}: Pick<
  UseHeroAnimationOptions,
  "shouldReduceMotion" | "shouldSkipEntranceAnimation" | "skipAnimations"
>) => shouldReduceMotion || skipAnimations || shouldSkipEntranceAnimation;

const stopAndLogHeroMetrics = (
  label: string,
  performanceMetrics: AnimationMetrics
) => {
  logHeroMetrics(label, performanceMetrics, performanceMetrics.stopTracking());
};

const getHeroOffset = (isDesktop: boolean) => {
  if (isDesktop) {
    return 0;
  }

  return -40;
};

const getHeroButtons = (buttonsRef: RefObject<HTMLDivElement | null>) =>
  buttonsRef.current?.children || [];

const setSkippedHeroState = ({
  buttons,
  image,
}: {
  buttons: HTMLCollection | never[];
  image: HTMLDivElement | null;
}) => {
  gsapCore.set(image, {
    autoAlpha: 1,
    rotate: 0,
    scale: 1,
    x: 0,
  });
  gsapCore.set(".char", { autoAlpha: 1, y: 0 });
  gsapCore.set(".hero-badge", { autoAlpha: 1, scale: 1 });
  gsapCore.set(".hero-text", { autoAlpha: 1, y: 0 });
  gsapCore.set(buttons, {
    autoAlpha: 1,
    y: 0,
  });
};

const animateHeroEntrance = ({
  buttons,
  image,
  imageOffset,
  onComplete,
}: {
  buttons: HTMLCollection | never[];
  image: HTMLDivElement | null;
  imageOffset: number;
  onComplete: () => void;
}) => {
  const timeline = gsapCore.timeline({
    defaults: { ease: ANIMATION_EASING.DEFAULT },
    onComplete,
  });

  timeline
    .fromTo(
      image,
      {
        autoAlpha: 0,
        rotate: -15,
        scale: 0,
        x: imageOffset,
      },
      {
        autoAlpha: 1,
        duration: mediumFastSeconds,
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
        duration: mediumFastSeconds,
        ease: ANIMATION_EASING.DEFAULT,
        stagger: ANIMATION_STAGGER.QUICK,
        y: 0,
      },
      `-=${mediumFastSeconds - 0.1}`
    )
    .fromTo(
      ".hero-badge",
      { autoAlpha: 0, scale: 0 },
      {
        autoAlpha: 1,
        duration: quickSeconds,
        ease: ANIMATION_EASING.BACK_STRONG,
        scale: 1,
      },
      `-=${mediumFastSeconds - 0.05}`
    )
    .fromTo(
      ".hero-text",
      {
        autoAlpha: 0,
        y: 40,
      },
      {
        autoAlpha: 1,
        duration: mediumFastSeconds,
        ease: ANIMATION_EASING.DEFAULT,
        stagger: ANIMATION_STAGGER.QUICK,
        y: 0,
      },
      `-=${mediumFastSeconds}`
    )
    .fromTo(
      buttons,
      {
        autoAlpha: 0,
        y: 20,
      },
      {
        autoAlpha: 1,
        duration: mediumFastSeconds,
        ease: ANIMATION_EASING.POWER3,
        stagger: ANIMATION_STAGGER.QUICK,
        y: 0,
      },
      `-=${mediumFastSeconds}`
    );
};

export const useHeroAnimation = ({
  buttonsRef,
  containerRef,
  imageRef,
  shouldReduceMotion,
  shouldSkipEntranceAnimation,
  skipAnimations,
}: UseHeroAnimationOptions) => {
  const performanceMetrics = useAnimationPerformance();

  useGSAP(
    () => {
      const mm = gsapCore.matchMedia();
      const shouldSkip = shouldUseStaticHeroState({
        shouldReduceMotion,
        shouldSkipEntranceAnimation,
        skipAnimations,
      });

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const { isDesktop } = context.conditions as { isDesktop: boolean };
          const offset = getHeroOffset(isDesktop);
          const buttons = getHeroButtons(buttonsRef);

          performanceMetrics.startTracking();

          if (shouldSkip) {
            setSkippedHeroState({
              buttons,
              image: imageRef.current,
            });

            stopAndLogHeroMetrics(
              "[Hero] Animations skipped - Performance metrics:",
              performanceMetrics
            );
            return;
          }

          animateHeroEntrance({
            buttons,
            image: imageRef.current,
            imageOffset: offset,
            onComplete: () => {
              stopAndLogHeroMetrics(
                "[Hero] Animation complete - Performance metrics:",
                performanceMetrics
              );
            },
          });
        }
      );
    },
    {
      dependencies: [
        shouldReduceMotion,
        shouldSkipEntranceAnimation,
        skipAnimations,
      ],
      scope: containerRef,
    }
  );
};
