"use client";

import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { useAnimationSkip } from "@/lib/hooks/animation/use-animation-skip";

type AnimationSkipContextValue = ReturnType<typeof useAnimationSkip>;

const AnimationSkipContext = createContext<AnimationSkipContextValue | null>(
  null
);

/**
 * Provider component that manages global animation skip state.
 *
 * This provider:
 * - Listens for Escape key to skip animations
 * - Persists skip state to localStorage
 * - Makes skip state available to all child components
 *
 * Place this provider at the root of your app to enable global animation skipping.
 *
 * @example
 * ```tsx
 * <AnimationSkipProvider>
 *   <App />
 * </AnimationSkipProvider>
 * ```
 */
export function AnimationSkipProvider({ children }: { children: ReactNode }) {
  const animationSkip = useAnimationSkip();

  return (
    <AnimationSkipContext.Provider value={animationSkip}>
      {children}
    </AnimationSkipContext.Provider>
  );
}

/**
 * Hook to access the global animation skip state.
 *
 * Returns the same value as useAnimationSkip, but from context.
 * This hook must be used within an AnimationSkipProvider.
 *
 * @example
 * ```tsx
 * const { skipAnimations, setSkipAnimations } = useAnimationSkipContext();
 *
 * if (skipAnimations) {
 *   // Skip animations
 * }
 * ```
 */
export function useAnimationSkipContext(): AnimationSkipContextValue {
  const context = useContext(AnimationSkipContext);
  if (!context) {
    throw new Error(
      "useAnimationSkipContext must be used within an AnimationSkipProvider"
    );
  }
  return context;
}
