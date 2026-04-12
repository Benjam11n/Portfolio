"use client";

import gsapCore from "gsap";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

const DARK_PROFILE_IMAGE_SRC = "/benjamin.avif";
const LIGHT_PROFILE_IMAGE_SRC = "/benjamin-light.avif";

interface UseProfileImageSourceOptions {
  animationRef?: RefObject<HTMLElement | null>;
  prefersReducedMotion?: boolean;
}

export const useProfileImageSource = ({
  animationRef,
  prefersReducedMotion = false,
}: UseProfileImageSourceOptions = {}) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const previousThemeRef = useRef<string | null>(null);

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

    gsapCore.fromTo(
      animationRef.current,
      {
        autoAlpha: 0.8,
        scale: 0.96,
        y: 4,
      },
      {
        autoAlpha: 1,
        duration: 0.28,
        ease: "power2.out",
        overwrite: "auto",
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
