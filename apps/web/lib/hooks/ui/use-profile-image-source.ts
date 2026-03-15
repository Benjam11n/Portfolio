"use client";

import gsap from "gsap";
import { useTheme } from "next-themes";
import { type RefObject, useEffect, useRef, useState } from "react";

const DARK_PROFILE_IMAGE_SRC = "/benjamin.png";
const LIGHT_PROFILE_IMAGE_SRC = "/benjamin-light.png";

type UseProfileImageSourceOptions = {
  animationRef?: RefObject<HTMLElement | null>;
  prefersReducedMotion?: boolean;
};

export const useProfileImageSource = ({
  animationRef,
  prefersReducedMotion = false,
}: UseProfileImageSourceOptions = {}) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const previousThemeRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const currentTheme = resolvedTheme ?? "dark";
    const previousTheme = previousThemeRef.current;

    previousThemeRef.current = currentTheme;

    if (
      !(animationRef?.current && previousTheme) ||
      previousTheme === currentTheme ||
      prefersReducedMotion
    ) {
      return;
    }

    gsap.fromTo(
      animationRef.current,
      {
        autoAlpha: 0.8,
        scale: 0.96,
        y: 4,
      },
      {
        autoAlpha: 1,
        clearProps: "opacity,transform",
        duration: 0.28,
        ease: "power2.out",
        scale: 1,
        y: 0,
      }
    );
  }, [animationRef, mounted, prefersReducedMotion, resolvedTheme]);

  if (!mounted) {
    return DARK_PROFILE_IMAGE_SRC;
  }

  return resolvedTheme === "light"
    ? LIGHT_PROFILE_IMAGE_SRC
    : DARK_PROFILE_IMAGE_SRC;
};
