"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Custom hook to manage global animation skip state.
 *
 * This hook provides:
 * - In-memory animation skip state for the current page session
 * - Escape key listener to toggle skip state
 * - Methods to get, set, and reset the skip state
 *
 * Use this hook to:
 * - Allow users to skip all animations by pressing Escape
 * - Reset animation state automatically on refresh
 * - Provide instant animation completion without persisting the preference
 *
 * @example
 * ```tsx
 * const { skipAnimations, setSkipAnimations, resetSkipAnimations } = useAnimationSkip();
 *
 * if (skipAnimations) {
 *   // Skip animation and show final state
 * } else {
 *   // Play animation normally
 * }
 * ```
 */
export const useAnimationSkip = (): {
  /** Whether animations should be skipped */
  skipAnimations: boolean;
  /** Set the skip state manually */
  setSkipAnimations: (value: boolean) => void;
  /** Reset the skip state to false */
  resetSkipAnimations: () => void;
} => {
  const [skipAnimations, setSkipAnimationsState] = useState(false);

  const setSkipAnimations = useCallback((value: boolean) => {
    setSkipAnimationsState(value);
  }, []);

  // Reset skip state
  const resetSkipAnimations = useCallback(() => {
    setSkipAnimationsState(false);
  }, []);

  // Listen for Escape key to toggle skip state
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) {
        return;
      }

      if (event.key === "Escape") {
        setSkipAnimationsState((current) => !current);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return {
    resetSkipAnimations,
    setSkipAnimations,
    skipAnimations,
  };
};
