"use client";

/**
 * Development-only performance monitor component.
 *
 * Displays real-time animation performance metrics including FPS, frame time,
 * frame drops, and tracking status. This component only renders in development
 * mode and is automatically excluded from production builds.
 *
 * Metrics displayed:
 * - Current FPS: Frames per second (target: 60, minimum: 30)
 * - Frame time: Average time per frame in milliseconds (target: <16.67ms, maximum: 33ms)
 * - Frame drops: Number of frames that exceeded 33ms during tracking period
 * - Tracking status: Whether an animation is currently being tracked
 *
 * @example
 * ```tsx
 * // In layout.tsx or any component
 * import { PerformanceMonitor } from "@/components/dev/performance-monitor";
 *
 * export default function Layout({ children }) {
 *   return (
 *     <>
 *       {children}
 *       <PerformanceMonitor />
 *     </>
 *   );
 * }
 * ```
 */

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { useAnimationPerformance } from "@/lib/hooks/animation/use-animation-performance";

const getStatusColor = (fpsValue: number) => {
  if (fpsValue < 30) {
    return "text-red-500";
  }
  if (fpsValue < 50) {
    return "text-yellow-500";
  }
  return "text-green-500";
};

const unsubscribeFromHydration = () => {
  // useSyncExternalStore needs a cleanup function; no subscription is opened.
};
const subscribeToHydration = () => unsubscribeFromHydration;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const useHasHydrated = () =>
  useSyncExternalStore(
    subscribeToHydration,
    getClientSnapshot,
    getServerSnapshot
  );

const getThemeClasses = (theme?: string) => {
  if (theme === "dark") {
    return {
      background: "bg-black/80 backdrop-blur-sm",
      bar: "bg-gray-700",
      label: "text-gray-400",
      text: "text-gray-200",
    };
  }

  return {
    background: "bg-white/80 backdrop-blur-sm",
    bar: "bg-gray-300",
    label: "text-gray-600",
    text: "text-gray-800",
  };
};

const MetricRow = ({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: React.ReactNode;
  valueClassName: string;
}) => (
  <div className="flex items-center justify-between">
    <span>{label}:</span>
    <span className={valueClassName}>{value}</span>
  </div>
);

const PerformanceBar = ({
  barColor,
  fps,
}: {
  barColor: string;
  fps: number;
}) => (
  <div className={`mt-2 h-1 w-full rounded-full ${barColor}`}>
    <div
      className={`h-full rounded-full transition-all duration-300 ${getStatusColor(
        fps
      )}`}
      style={{
        width: `${Math.min((fps / 60) * 100, 100)}%`,
      }}
    />
  </div>
);

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
      style={{
        minWidth: "180px",
      }}
    >
      {/* Header */}
      <div className={`mb-2 font-semibold ${themeClasses.label}`}>
        Performance Monitor
      </div>

      {/* Metrics */}
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
  // Only render in development mode
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return <PerformanceMonitorContent />;
};
