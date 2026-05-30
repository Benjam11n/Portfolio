"use client";

import { useTheme } from "next-themes";

import { MetricRow } from "@/components/shared/dev/performance-monitor/metric-row";
import { PerformanceBar } from "@/components/shared/dev/performance-monitor/performance-bar";
import {
  getStatusColor,
  getThemeClasses,
} from "@/components/shared/dev/performance-monitor/utils";
import { useAnimationPerformance } from "@/lib/hooks/animation/use-animation-performance";
import { useHasHydrated } from "@/lib/hooks/ui/use-has-hydrated";

const PerformanceMonitorContent = () => {
  const { fps, frameTime, frameDrops, isTracking } = useAnimationPerformance();
  const { theme } = useTheme();
  const hasHydrated = useHasHydrated();

  if (!hasHydrated) {
    return null;
  }

  const themeClasses = getThemeClasses(theme);

  return (
    <div
      className={`fixed right-4 bottom-4 z-50 rounded-lg border border-gray-700/30 p-3 font-mono text-xs shadow-lg ${themeClasses.background}`}
      style={{ minWidth: "180px" }}
    >
      <div className={`mb-2 font-semibold ${themeClasses.label}`}>
        Performance Monitor
      </div>

      <div className={`space-y-1 ${themeClasses.label}`}>
        <MetricRow
          label="FPS"
          value={fps}
          valueClassName={`${getStatusColor(fps)} font-bold`}
        />
        <MetricRow
          label="Frame Time"
          value={
            <>
              {frameTime}
              <span className={`${themeClasses.label} ml-0.5`}>ms</span>
            </>
          }
          valueClassName={themeClasses.text}
        />
        <MetricRow
          label="Frame Drops"
          value={frameDrops}
          valueClassName={themeClasses.text}
        />
        <MetricRow
          label="Tracking"
          value={isTracking ? "Active" : "Idle"}
          valueClassName={
            isTracking
              ? `${themeClasses.text} text-blue-400`
              : themeClasses.label
          }
        />
      </div>

      <PerformanceBar barColor={themeClasses.bar} fps={fps} />
    </div>
  );
};

export const PerformanceMonitor = () => {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return <PerformanceMonitorContent />;
};
