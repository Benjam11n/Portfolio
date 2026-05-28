"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface AnimationPerformanceMetrics {
  fps: number;
  frameTime: number;
  isTracking: boolean;
  duration: number;
  frameDrops: number;
}

const FRAME_DROP_THRESHOLD_MS = 33;
const FPS_SAMPLE_INTERVAL_MS = 1000;
const DEFAULT_METRICS: AnimationPerformanceMetrics = {
  duration: 0,
  fps: 60,
  frameDrops: 0,
  frameTime: 16.67,
  isTracking: false,
};

export const useAnimationPerformance = (): AnimationPerformanceMetrics & {
  startTracking: () => void;
  stopTracking: () => number;
} => {
  const [metrics, setMetrics] =
    useState<AnimationPerformanceMetrics>(DEFAULT_METRICS);
  const trackerRef = useRef({
    animationFrameId: null as number | null,
    frameCount: 0,
    frameDrops: 0,
    lastFrameTime: 0,
    sampleStartTime: 0,
    startTime: null as number | null,
  });

  const cancelMeasurementFrame = useCallback(() => {
    const tracker = trackerRef.current;

    if (tracker.animationFrameId !== null) {
      cancelAnimationFrame(tracker.animationFrameId);
      tracker.animationFrameId = null;
    }
  }, []);

  const measurePerformance = useCallback((currentTime: number) => {
    const tracker = trackerRef.current;

    if (tracker.startTime === null) {
      tracker.animationFrameId = null;
      return;
    }

    const deltaTime = currentTime - tracker.lastFrameTime;
    tracker.frameCount += 1;
    tracker.lastFrameTime = currentTime;

    if (deltaTime > FRAME_DROP_THRESHOLD_MS) {
      tracker.frameDrops += 1;
    }

    if (currentTime - tracker.sampleStartTime >= FPS_SAMPLE_INTERVAL_MS) {
      const elapsedMs = currentTime - tracker.sampleStartTime;
      const frameCount = Math.max(tracker.frameCount, 1);

      setMetrics((prev) => ({
        ...prev,
        fps: Math.round((tracker.frameCount * 1000) / elapsedMs),
        frameDrops: tracker.frameDrops,
        frameTime: Math.round(elapsedMs / frameCount),
      }));
      tracker.frameCount = 0;
      tracker.sampleStartTime = currentTime;
    }

    tracker.animationFrameId = requestAnimationFrame(measurePerformance);
  }, []);

  useEffect(() => cancelMeasurementFrame, [cancelMeasurementFrame]);

  const startTracking = useCallback(() => {
    const now = performance.now();
    const tracker = trackerRef.current;

    cancelMeasurementFrame();
    tracker.frameCount = 0;
    tracker.frameDrops = 0;
    tracker.lastFrameTime = now;
    tracker.sampleStartTime = now;
    tracker.startTime = now;
    tracker.animationFrameId = requestAnimationFrame(measurePerformance);

    setMetrics({
      ...DEFAULT_METRICS,
      isTracking: true,
    });
  }, [cancelMeasurementFrame, measurePerformance]);

  const stopTracking = useCallback(() => {
    const tracker = trackerRef.current;

    if (tracker.startTime === null) {
      return 0;
    }

    const duration = performance.now() - tracker.startTime;
    const { frameDrops } = tracker;

    cancelMeasurementFrame();
    tracker.startTime = null;
    setMetrics((prev) => ({
      ...prev,
      duration,
      frameDrops,
      isTracking: false,
    }));

    return duration;
  }, [cancelMeasurementFrame]);

  return {
    ...metrics,
    startTracking,
    stopTracking,
  };
};
