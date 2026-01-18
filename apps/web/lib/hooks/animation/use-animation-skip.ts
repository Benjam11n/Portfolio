"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "animation-skipped";

/**
 * Custom hook to manage global animation skip state.
 *
 * This hook provides:
 * - Global animation skip state persisted in localStorage
 * - Escape key listener to toggle skip state
 * - Methods to get, set, and reset the skip state
 *
 * Use this hook to:
 * - Allow users to skip all animations by pressing Escape
 * - Remember user preference across sessions
 * - Provide instant animation completion for returning visitors
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
export function useAnimationSkip(): {
  /** Whether animations should be skipped */
  skipAnimations: boolean;
  /** Set the skip state manually */
  setSkipAnimations: (value: boolean) => void;
  /** Reset the skip state to false */
  resetSkipAnimations: () => void;
} {
  // Initialize state from localStorage
  const [skipAnimations, setSkipAnimationsState] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === "true";
    } catch {
      return false;
    }
  });

  // Update localStorage when state changes
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, String(skipAnimations));
    } catch {
      // Silently fail if localStorage is not available
    }
  }, [skipAnimations]);

  // Set skip state with localStorage sync
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
      if (event.key === "Escape") {
        setSkipAnimationsState(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return {
    skipAnimations,
    setSkipAnimations,
    resetSkipAnimations,
  };
}
