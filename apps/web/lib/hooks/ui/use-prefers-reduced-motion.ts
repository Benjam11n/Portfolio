"use client";

import { useEffect, useState } from "react";

/**
 * Custom hook to detect prefers-reduced-motion setting.
 * Returns true if user prefers reduced motion.
 *
 * Use this hook to respect user accessibility preferences by:
 * - Disabling animations
 * - Reducing motion effects
 * - Using instant instead of smooth scrolling
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = usePrefersReducedMotion();
 *
 * if (prefersReducedMotion) {
 *   // Skip animation or use reduced motion alternative
 * }
 * ```
 */
export const usePrefersReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
};
