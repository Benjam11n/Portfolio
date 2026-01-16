"use client";

import { useEffect, useRef } from "react";

export type AnimationCallback = (timestamp: number) => void;

export type UseAnimationFrameOptions = {
  /**
   * Target FPS for the animation loop.
   * If not provided, runs at screen refresh rate (typically 60fps).
   * Useful for performance optimization or creating specific animation styles.
   */
  fps?: number;
  /**
   * Whether to respect the user's prefers-reduced-motion setting.
   * When true, the animation loop won't start if the user prefers reduced motion.
   * @default true
   */
  respectReducedMotion?: boolean;
};

export type UseAnimationFrameReturn = {
  /**
   * The current animation frame ID, can be used with cancelAnimationFrame if needed.
   */
  animationFrameId: number | null;
};

/**
 * Custom hook for managing requestAnimationFrame loops with automatic cleanup.
 *
 * Use this hook to run animation loops in React components:
 * - Automatically handles requestAnimationFrame and cleanup
 * - Supports optional FPS throttling for performance
 * - Respects user accessibility preferences for reduced motion
 * - Returns animation frame ID for manual control if needed
 *
 * @param callback - Function to call on each animation frame. Receives the timestamp parameter from requestAnimationFrame.
 * @param options - Optional configuration object
 * @returns Object containing the current animation frame ID
 *
 * @example
 * ```tsx
 * // Basic usage - runs at screen refresh rate
 * useAnimationFrame((timestamp) => {
 *   // Update animation state based on timestamp
 *   setPosition(prev => prev + velocity);
 * });
 * ```
 *
 * @example
 * ```tsx
 * // With FPS throttling
 * useAnimationFrame((timestamp) => {
 *   // This will run at most 30 times per second
 *   updateAnimation();
 * }, { fps: 30 });
 * ```
 *
 * @example
 * ```tsx
 * // With reduced motion support
 * const prefersReducedMotion = usePrefersReducedMotion();
 *
 * useAnimationFrame((timestamp) => {
 *   // Animation will pause if user prefers reduced motion
 *   drawFrame(timestamp);
 * }, { respectReducedMotion: true });
 * ```
 *
 * @example
 * ```tsx
 * // Access to animation frame ID for manual control
 * const { animationFrameId } = useAnimationFrame((timestamp) => {
 *   updatePhysics(timestamp);
 * });
 *
 * // Later, if needed to cancel manually
 * if (animationFrameId) {
 *   cancelAnimationFrame(animationFrameId);
 * }
 * ```
 */
export function useAnimationFrame(
  callback: AnimationCallback,
  options: UseAnimationFrameOptions = {}
): UseAnimationFrameReturn {
  const { fps, respectReducedMotion = true } = options;

  const animationFrameIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const isCancelledRef = useRef<boolean>(false);

  useEffect(() => {
    isCancelledRef.current = false;

    // Check if user prefers reduced motion
    if (respectReducedMotion) {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) {
        return;
      }
    }

    const frameDuration = fps ? 1000 / fps : 0;

    const run = (timestamp: number) => {
      if (isCancelledRef.current) {
        return;
      }

      // Throttle FPS if specified
      if (
        frameDuration > 0 &&
        timestamp - lastFrameTimeRef.current < frameDuration
      ) {
        animationFrameIdRef.current = window.requestAnimationFrame(run);
        return;
      }

      lastFrameTimeRef.current = timestamp;
      callback(timestamp);

      animationFrameIdRef.current = window.requestAnimationFrame(run);
    };

    animationFrameIdRef.current = window.requestAnimationFrame(run);

    return () => {
      isCancelledRef.current = true;
      if (animationFrameIdRef.current !== null) {
        window.cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [callback, fps, respectReducedMotion]);

  return {
    animationFrameId: animationFrameIdRef.current,
  };
}
