"use client";

import gsapCore from "gsap";
import { useTheme } from "next-themes";
import { useEffect, useRef, useSyncExternalStore } from "react";
import type { RefObject } from "react";

const DARK_PROFILE_IMAGE_SRC = "/benjamin.avif";
const LIGHT_PROFILE_IMAGE_SRC = "/benjamin-light.avif";

interface UseProfileImageSourceOptions {
  animationRef?: RefObject<HTMLElement | null>;
  prefersReducedMotion?: boolean;
}

const unsubscribeFromHydration = () => {
  // useSyncExternalStore needs a cleanup function; no subscription is opened.
};
const subscribeToHydration = () => unsubscribeFromHydration;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const useHasHydrated = () =>
  useSyncExternalStore(
    subscribeToHydration,
    getClientSnapshot,
    getServerSnapshot
  );

const getProfileImageSource = (theme?: string) => {
  if (theme === "light") {
    return LIGHT_PROFILE_IMAGE_SRC;
  }

  return DARK_PROFILE_IMAGE_SRC;
};

const shouldAnimateThemeChange = ({
  animationRef,
  currentTheme,
  prefersReducedMotion,
  previousTheme,
}: {
  animationRef?: RefObject<HTMLElement | null>;
  currentTheme: string;
  prefersReducedMotion: boolean;
  previousTheme: string | null;
}) =>
  Boolean(animationRef?.current) &&
  Boolean(previousTheme) &&
  previousTheme !== currentTheme &&
  !prefersReducedMotion;

const animateProfileImageThemeChange = (element: HTMLElement) => {
  gsapCore.fromTo(
    element,
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
};

export const useProfileImageSource = ({
  animationRef,
  prefersReducedMotion = false,
}: UseProfileImageSourceOptions = {}) => {
  const { resolvedTheme } = useTheme();
  const hasHydrated = useHasHydrated();
  const previousThemeRef = useRef<string | null>(null);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    const currentTheme = resolvedTheme ?? "dark";
    const previousTheme = previousThemeRef.current;

    previousThemeRef.current = currentTheme;

    if (
      !shouldAnimateThemeChange({
        animationRef,
        currentTheme,
        prefersReducedMotion,
        previousTheme,
      })
    ) {
      return;
    }

    animateProfileImageThemeChange(animationRef?.current as HTMLElement);
  }, [animationRef, hasHydrated, prefersReducedMotion, resolvedTheme]);

  if (!hasHydrated) {
    return DARK_PROFILE_IMAGE_SRC;
  }

  return getProfileImageSource(resolvedTheme);
};
