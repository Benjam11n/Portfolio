"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Performance metrics for animation monitoring.
 */
type AnimationPerformanceMetrics = {
  /** Current frames per second */
  fps: number;
  /** Average frame time in milliseconds */
  frameTime: number;
  /** Whether an animation is currently being tracked */
  isTracking: boolean;
  /** Duration of the last tracked animation in milliseconds */
  duration: number;
  /** Number of frame drops during tracking */
  frameDrops: number;
};

/**
 * Custom hook to monitor animation frame rate and duration.
 * Returns real-time performance metrics for animations.
 *
 * Use this hook to:
 * - Monitor animation frame rate (FPS)
 * - Track animation duration
 * - Detect frame drops and performance issues
 * - Ensure animations stay within performance budget
 *
 * @example
 * ```tsx
 * const metrics = useAnimationPerformance();
 *
 * // Start tracking an animation
 * const startTracking = () => {
 *   metrics.startTracking();
 * };
 *
 * // Stop tracking and get duration
 * const stopTracking = () => {
 *   const duration = metrics.stopTracking();
 *   console.log(`Animation took ${duration}ms`);
 * };
 *
 * // Check performance
 * if (metrics.fps < 30) {
 *   console.warn('Animation performance is poor');
 * }
 *
 * // In development, log metrics
 * if (process.env.NODE_ENV === 'development') {
 *   console.log('FPS:', metrics.fps);
 *   console.log('Frame time:', metrics.frameTime);
 * }
 * ```
 */
export function useAnimationPerformance(): AnimationPerformanceMetrics & {
  startTracking: () => void;
  stopTracking: () => number;
} {
  const [metrics, setMetrics] = useState<AnimationPerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    isTracking: false,
    duration: 0,
    frameDrops: 0,
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const startTimeRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef(performance.now());
  const totalFrameDropsRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const measurePerformance = (currentTime: number) => {
      frameCountRef.current++;
      const deltaTime = currentTime - lastFrameTimeRef.current;
      lastFrameTimeRef.current = currentTime;

      // Check for frame drops (if frame time > 33ms, which is < 30fps)
      if (deltaTime > 33) {
        totalFrameDropsRef.current++;
      }

      // Update metrics every second
      if (currentTime - lastTimeRef.current >= 1000) {
        const fps = Math.round(
          (frameCountRef.current * 1000) / (currentTime - lastTimeRef.current)
        );
        const frameTime = Math.round(
          (currentTime - lastTimeRef.current) / frameCountRef.current
        );

        setMetrics((prev) => ({
          ...prev,
          fps,
          frameTime,
          frameDrops: totalFrameDropsRef.current,
        }));

        // Log performance budget warnings in development
        if (process.env.NODE_ENV === "development") {
          // Check FPS budget (< 30 FPS)
          if (fps < 30) {
            console.warn(
              `[useAnimationPerformance] ⚠️ Performance budget exceeded: FPS dropped to ${fps} (threshold: 30)`
            );
          }

          // Check frame time budget (> 33ms)
          if (frameTime > 33) {
            console.warn(
              `[useAnimationPerformance] ⚠️ Performance budget exceeded: Frame time is ${frameTime}ms (threshold: 33ms)`
            );
          }

          // Check frame drops percentage (> 10%)
          if (frameCountRef.current > 0) {
            const frameDropPercentage =
              (totalFrameDropsRef.current / frameCountRef.current) * 100;
            if (frameDropPercentage > 10) {
              console.warn(
                `[useAnimationPerformance] ⚠️ Performance budget exceeded: Frame drops at ${frameDropPercentage.toFixed(1)}% (threshold: 10%)`
              );
            }
          }
        }

        // Reset counters
        frameCountRef.current = 0;
        lastTimeRef.current = currentTime;
        totalFrameDropsRef.current = 0;
      }

      animationFrameRef.current = requestAnimationFrame(measurePerformance);
    };

    // Start measuring performance
    animationFrameRef.current = requestAnimationFrame(measurePerformance);

    // Cleanup function
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const startTracking = useCallback(() => {
    startTimeRef.current = performance.now();
    setMetrics((prev) => ({
      ...prev,
      isTracking: true,
      duration: 0,
      frameDrops: 0,
    }));
    totalFrameDropsRef.current = 0;
  }, []);

  const stopTracking = useCallback(() => {
    if (startTimeRef.current !== null) {
      const duration = performance.now() - startTimeRef.current;
      setMetrics((prev) => ({
        ...prev,
        isTracking: false,
        duration,
      }));
      startTimeRef.current = null;
      return duration;
    }
    return 0;
  }, []);

  return {
    ...metrics,
    startTracking,
    stopTracking,
  };
}
