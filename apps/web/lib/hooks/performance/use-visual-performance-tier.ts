"use client";

import { useSyncExternalStore } from "react";

export type VisualPerformanceTier = "high" | "medium" | "low";

interface VisualPerformanceSignals {
  deviceMemory?: number;
  hardwareConcurrency?: number;
  prefersReducedMotion?: boolean;
  saveData?: boolean;
}

interface NetworkInformation {
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
  saveData?: boolean;
}

interface NavigatorWithPerformanceSignals extends Navigator {
  connection?: NetworkInformation;
  deviceMemory?: number;
}

const PERFORMANCE_TIER_KEY = "visual-performance-tier";
const RUNTIME_SAMPLE_DELAY_MS = 1800;
const RUNTIME_SAMPLE_SIZE = 120;
const SLOW_FRAME_MS = 25;
const MAX_FRAME_GAP_MS = 250;
const MAX_SLOW_FRAME_RATIO = 0.15;
const MAX_AVERAGE_FRAME_MS = 20;

const tierRank: Record<VisualPerformanceTier, number> = {
  high: 2,
  low: 0,
  medium: 1,
};

const lowerTier = (
  first: VisualPerformanceTier,
  second: VisualPerformanceTier
): VisualPerformanceTier =>
  tierRank[first] <= tierRank[second] ? first : second;

export const getInitialVisualPerformanceTier = ({
  deviceMemory,
  hardwareConcurrency,
  prefersReducedMotion,
  saveData,
}: VisualPerformanceSignals): VisualPerformanceTier => {
  if (
    prefersReducedMotion === true ||
    saveData === true ||
    (typeof hardwareConcurrency === "number" && hardwareConcurrency <= 4) ||
    (typeof deviceMemory === "number" && deviceMemory <= 4)
  ) {
    return "low";
  }

  if (
    (typeof hardwareConcurrency === "number" && hardwareConcurrency <= 6) ||
    (typeof deviceMemory === "number" && deviceMemory <= 6)
  ) {
    return "medium";
  }

  return "high";
};

const subscribers = new Set<() => void>();
let baseTier: VisualPerformanceTier = "high";
let runtimeTier: VisualPerformanceTier = "high";
let currentTier: VisualPerformanceTier = "high";
let cleanupStore: (() => void) | undefined;

const emitTier = () => {
  const nextTier = lowerTier(baseTier, runtimeTier);
  if (nextTier === currentTier) {
    return;
  }

  currentTier = nextTier;
  for (const subscriber of subscribers) {
    subscriber();
  }
};

const readPersistedRuntimeTier = (): VisualPerformanceTier => {
  try {
    const persistedTier = window.sessionStorage.getItem(PERFORMANCE_TIER_KEY);
    return persistedTier === "low" || persistedTier === "medium"
      ? persistedTier
      : "high";
  } catch {
    return "high";
  }
};

const persistRuntimeTier = () => {
  try {
    window.sessionStorage.setItem(PERFORMANCE_TIER_KEY, runtimeTier);
  } catch {
    // Storage may be unavailable in private or restricted browsing contexts.
  }
};

const demoteRuntimeTier = (): VisualPerformanceTier => {
  runtimeTier = runtimeTier === "high" ? "medium" : "low";
  persistRuntimeTier();
  emitTier();
  return runtimeTier;
};

const readBaseTier = (
  mediaQuery: MediaQueryList,
  deviceNavigator: NavigatorWithPerformanceSignals
) =>
  getInitialVisualPerformanceTier({
    deviceMemory: deviceNavigator.deviceMemory,
    hardwareConcurrency: deviceNavigator.hardwareConcurrency,
    prefersReducedMotion: mediaQuery.matches,
    saveData: deviceNavigator.connection?.saveData,
  });

const startRuntimeSample = () => {
  let animationFrameId = 0;
  let lastTimestamp: number | undefined;
  let sampleCount = 0;
  let slowFrameCount = 0;
  let totalFrameTime = 0;

  const sampleFrame = (timestamp: number) => {
    if (lastTimestamp !== undefined) {
      const frameTime = timestamp - lastTimestamp;
      if (frameTime <= MAX_FRAME_GAP_MS) {
        sampleCount += 1;
        totalFrameTime += frameTime;
        if (frameTime > SLOW_FRAME_MS) {
          slowFrameCount += 1;
        }
      }
    }
    lastTimestamp = timestamp;

    if (sampleCount < RUNTIME_SAMPLE_SIZE) {
      animationFrameId = window.requestAnimationFrame(sampleFrame);
      return;
    }

    const isSlow =
      slowFrameCount / sampleCount >= MAX_SLOW_FRAME_RATIO ||
      totalFrameTime / sampleCount > MAX_AVERAGE_FRAME_MS;
    if (isSlow && runtimeTier !== "low") {
      const nextRuntimeTier = demoteRuntimeTier();
      if (nextRuntimeTier !== "low") {
        lastTimestamp = undefined;
        sampleCount = 0;
        slowFrameCount = 0;
        totalFrameTime = 0;
        animationFrameId = window.requestAnimationFrame(sampleFrame);
      }
    }
  };

  animationFrameId = window.requestAnimationFrame(sampleFrame);
  return () => window.cancelAnimationFrame(animationFrameId);
};

const startStore = () => {
  const deviceNavigator = navigator as NavigatorWithPerformanceSignals;
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const { connection } = deviceNavigator;
  runtimeTier = readPersistedRuntimeTier();

  const updateBaseTier = () => {
    baseTier = readBaseTier(mediaQuery, deviceNavigator);
    emitTier();
  };

  updateBaseTier();
  mediaQuery.addEventListener("change", updateBaseTier);
  connection?.addEventListener?.("change", updateBaseTier);

  let stopRuntimeSample: (() => void) | undefined;
  const sampleTimeoutId = window.setTimeout(() => {
    if (currentTier !== "low" && document.visibilityState === "visible") {
      stopRuntimeSample = startRuntimeSample();
    }
  }, RUNTIME_SAMPLE_DELAY_MS);

  return () => {
    window.clearTimeout(sampleTimeoutId);
    stopRuntimeSample?.();
    mediaQuery.removeEventListener("change", updateBaseTier);
    connection?.removeEventListener?.("change", updateBaseTier);
  };
};

const subscribe = (subscriber: () => void) => {
  subscribers.add(subscriber);
  cleanupStore ??= startStore();

  return () => {
    subscribers.delete(subscriber);
    if (subscribers.size === 0) {
      cleanupStore?.();
      cleanupStore = undefined;
    }
  };
};

const getSnapshot = () => currentTier;
const getServerSnapshot = (): VisualPerformanceTier => "high";

export const useVisualPerformanceTier = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
