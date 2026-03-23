"use client";

import { useEffect, useState } from "react";

/**
 * Custom hook to detect mobile device viewport.
 * Returns true if the current viewport is mobile-sized (max-width: 768px).
 *
 * Use this hook to conditionally adjust 3D settings by:
 * - Reducing particle counts
 * - Lowering render quality settings
 * - Disabling expensive post-processing effects
 * - Simplifying animation complexity
 *
 * @example
 * ```tsx
 * const isMobile = useMobileDetection();
 *
 * const particleCount = isMobile ? 5000 : 20000;
 * const enableBloom = !isMobile;
 * ```
 */
export const useMobileDetection = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    setIsMobile(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
};
