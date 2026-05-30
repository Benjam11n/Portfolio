"use client";

import { useGSAP } from "@gsap/react";
import gsapCore from "gsap";
import { useRef } from "react";

import type {
  Card3DHandlersOptions,
  CardRefs,
  GlareAnimationOptions,
  ParallaxAnimationOptions,
  PointerState,
} from "@/components/shared/effects/card-3d/types";

const getPointerState = (
  event: React.MouseEvent<HTMLDivElement>,
  rect: DOMRect,
  rotationIntensity: number
): PointerState => {
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const normalizedX = (x - centerX) / centerX;
  const normalizedY = (y - centerY) / centerY;

  return {
    normalizedX,
    normalizedY,
    rotateX: normalizedY * -rotationIntensity,
    rotateY: normalizedX * rotationIntensity,
  };
};

const animateParallax = ({
  content,
  height,
  intensity,
  normalizedX,
  normalizedY,
  width,
}: ParallaxAnimationOptions) => {
  if (!(content && intensity > 0)) {
    return;
  }

  gsapCore.to(content, {
    duration: 0.3,
    ease: "power2.out",
    x: normalizedX * (width * intensity),
    y: normalizedY * (height * intensity),
  });
};

const animateGlare = ({
  glare,
  glareEnabled,
  glareIntensity,
  normalizedX,
  normalizedY,
  width,
  height,
}: GlareAnimationOptions) => {
  if (!(glare && glareEnabled)) {
    return;
  }

  gsapCore.to(glare, {
    duration: 0.3,
    ease: "power2.out",
    opacity: glareIntensity,
    x: (normalizedX * width) / -1.5,
    y: (normalizedY * height) / -1.5,
  });
};

const resetParallax = (content: HTMLDivElement | null, intensity: number) => {
  if (!(content && intensity > 0)) {
    return;
  }

  gsapCore.to(content, {
    duration: 0.5,
    ease: "power2.out",
    overwrite: true,
    x: 0,
    y: 0,
  });
};

const resetGlare = (glare: HTMLDivElement | null, glareEnabled: boolean) => {
  if (!(glare && glareEnabled)) {
    return;
  }

  gsapCore.to(glare, {
    duration: 0.5,
    ease: "power2.out",
    opacity: 0,
    overwrite: true,
    x: 0,
    y: 0,
  });
};

export const useCardRefs = (): CardRefs => ({
  cardRef: useRef<HTMLDivElement>(null),
  containerRef: useRef<HTMLDivElement>(null),
  contentRef: useRef<HTMLDivElement>(null),
  glareRef: useRef<HTMLDivElement>(null),
});

export const useCard3DHandlers = ({
  refs,
  settings,
  shouldDisable3D,
}: Card3DHandlersOptions) => {
  const { cardRef, containerRef, contentRef, glareRef } = refs;
  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldDisable3D || !containerRef.current || !cardRef.current) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const pointer = getPointerState(e, rect, settings.rotationIntensity);

    gsapCore.to(cardRef.current, {
      duration: 0.3,
      ease: "power2.out",
      rotateX: pointer.rotateX,
      rotateY: pointer.rotateY,
    });

    animateParallax({
      content: contentRef.current,
      height: rect.height,
      intensity: settings.parallaxIntensity,
      normalizedX: pointer.normalizedX,
      normalizedY: pointer.normalizedY,
      width: rect.width,
    });
    animateGlare({
      glare: glareRef.current,
      glareEnabled: settings.glare,
      glareIntensity: settings.glareIntensity,
      height: rect.height,
      normalizedX: pointer.normalizedX,
      normalizedY: pointer.normalizedY,
      width: rect.width,
    });
  });

  const handleMouseLeave = contextSafe(() => {
    if (shouldDisable3D || !cardRef.current) {
      return;
    }

    gsapCore.to(cardRef.current, {
      duration: 0.5,
      ease: "power2.out",
      overwrite: true,
      rotateX: 0,
      rotateY: 0,
    });

    resetParallax(contentRef.current, settings.parallaxIntensity);
    resetGlare(glareRef.current, settings.glare);
  });

  return { handleMouseLeave, handleMouseMove };
};
