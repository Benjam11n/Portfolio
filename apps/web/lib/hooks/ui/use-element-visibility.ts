"use client";

import type { RefObject } from "react";
import { useEffect, useState } from "react";

/**
 * Custom hook to detect if an element is visible in the viewport AND the page is visible.
 * Returns true when both conditions are met:
 * - Element is intersecting with the viewport (IntersectionObserver)
 * - Page/tab is currently visible (Page Visibility API)
 *
 * Use this hook to optimize performance by:
 * - Pausing animations when off-screen
 * - Deferring expensive computations until visible
 * - Reducing GPU/CPU usage for background elements
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * const isVisible = useElementVisibility(ref);
 *
 * if (isVisible) {
 *   // Run animation or expensive computation
 * }
 * ```
 */
export const useElementVisibility = (
  ref: RefObject<HTMLElement | null>
): boolean => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);

  useEffect(() => {
    // Track page visibility using Page Visibility API
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    // Track element visibility using Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
      },
      {
        // Trigger when element is at least partially visible
        threshold: 0,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  // Element is only "visible" if both it's in viewport AND page is active
  return isVisible && isPageVisible;
};
