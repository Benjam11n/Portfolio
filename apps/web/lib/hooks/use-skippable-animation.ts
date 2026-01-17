"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

/**
 * Animation progress state for skippable animations.
 */
type SkippableAnimationState = {
  /** Current progress of the animation (0-1) */
  progress: number;
  /** Whether the animation is currently playing */
  isPlaying: boolean;
  /** Whether the animation has been skipped */
  isSkipped: boolean;
  /** Whether the animation has completed */
  isCompleted: boolean;
};

/**
 * Options for configuring skippable animations.
 */
type SkippableAnimationOptions = {
  /** Duration of the animation in milliseconds */
  duration?: number;
  /** Whether to respect reduced motion preferences */
  respectReducedMotion?: boolean;
  /** Callback when animation starts */
  onStart?: () => void;
  /** Callback when animation progress updates */
  onProgress?: (progress: number) => void;
  /** Callback when animation completes */
  onComplete?: () => void;
  /** Callback when animation is skipped */
  onSkip?: () => void;
};

/**
 * Custom hook to manage skippable animations with progress tracking.
 * Returns animation state and control methods for animation lifecycle.
 *
 * Use this hook to:
 * - Track animation progress in real-time
 * - Allow users to skip long animations
 * - Respect reduced motion preferences
 * - Get callbacks for animation lifecycle events
 *
 * @example
 * ```tsx
 * const animation = useSkippableAnimation({
 *   duration: 2000,
 *   respectReducedMotion: true,
 *   onStart: () => console.log('Animation started'),
 *   onComplete: () => console.log('Animation completed'),
 *   onSkip: () => console.log('Animation skipped'),
 * });
 *
 * // Start the animation
 * animation.start();
 *
 * // Skip the animation
 * animation.skip();
 *
 * // Reset for replay
 * animation.reset();
 * ```
 */
export function useSkippableAnimation(
  options: SkippableAnimationOptions = {}
): SkippableAnimationState & {
  start: () => void;
  skip: () => void;
  reset: () => void;
} {
  const {
    duration = 2000,
    respectReducedMotion = true,
    onStart,
    onProgress,
    onComplete,
    onSkip,
  } = options;

  const prefersReducedMotion = usePrefersReducedMotion();

  const [state, setState] = useState<SkippableAnimationState>({
    progress: 0,
    isPlaying: false,
    isSkipped: false,
    isCompleted: false,
  });

  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Cleanup animation frame
  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const updateProgress = useCallback(
    (progress: number) => {
      setState((prev) => ({ ...prev, progress }));
      onProgress?.(progress);
    },
    [onProgress]
  );

  const markCompleted = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    startTimeRef.current = null;
    setState({
      progress: 1,
      isPlaying: false,
      isSkipped: false,
      isCompleted: true,
    });
    onComplete?.();
  }, [onComplete]);

  const animate = useCallback(
    (currentTime: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const newProgress = Math.min(elapsed / duration, 1);

      updateProgress(newProgress);

      if (newProgress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        markCompleted();
      }
    },
    [duration, updateProgress, markCompleted]
  );

  const start = useCallback(() => {
    // If reduced motion is preferred and respectReducedMotion is true,
    // skip animation immediately
    if (respectReducedMotion && prefersReducedMotion) {
      setState({
        progress: 1,
        isPlaying: false,
        isSkipped: false,
        isCompleted: true,
      });
      onComplete?.();
      return;
    }

    // Reset state if starting a new animation
    if (state.isCompleted || state.isSkipped) {
      setState({
        progress: 0,
        isPlaying: true,
        isSkipped: false,
        isCompleted: false,
      });
    } else {
      setState((prev) => ({ ...prev, isPlaying: true }));
    }

    startTimeRef.current = null;
    onStart?.();
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [
    respectReducedMotion,
    prefersReducedMotion,
    state.isCompleted,
    state.isSkipped,
    onStart,
    onComplete,
    animate,
  ]);

  const skip = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    startTimeRef.current = null;
    setState({
      progress: 1,
      isPlaying: false,
      isSkipped: true,
      isCompleted: true,
    });
    onSkip?.();
  }, [onSkip]);

  const reset = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    startTimeRef.current = null;
    setState({
      progress: 0,
      isPlaying: false,
      isSkipped: false,
      isCompleted: false,
    });
  }, []);

  return {
    ...state,
    start,
    skip,
    reset,
  };
}
