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
import { useEffect, useState } from "react";
import { useAnimationPerformance } from "@/lib/hooks/use-animation-performance";

export function PerformanceMonitor() {
  // Only render in development mode
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return <PerformanceMonitorContent />;
}

function PerformanceMonitorContent() {
  const { fps, frameTime, frameDrops, isTracking } = useAnimationPerformance();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Determine status color based on performance
  const getStatusColor = (fps: number) => {
    if (fps < 30) {
      return "text-red-500";
    }
    if (fps < 50) {
      return "text-yellow-500";
    }
    return "text-green-500";
  };

  const bgColor =
    theme === "dark"
      ? "bg-black/80 backdrop-blur-sm"
      : "bg-white/80 backdrop-blur-sm";
  const textColor = theme === "dark" ? "text-gray-200" : "text-gray-800";
  const labelColor = theme === "dark" ? "text-gray-400" : "text-gray-600";

  return (
    <div
      className={`fixed right-4 bottom-4 z-50 rounded-lg border border-gray-700/30 p-3 font-mono text-xs shadow-lg ${bgColor}`}
      style={{
        minWidth: "180px",
      }}
    >
      {/* Header */}
      <div className={`mb-2 font-semibold ${labelColor}`}>
        Performance Monitor
      </div>

      {/* Metrics */}
      <div className="space-y-1">
        {/* FPS */}
        <div className="flex items-center justify-between">
          <span className={`${labelColor}`}>FPS:</span>
          <span className={`${getStatusColor(fps)} font-bold`}>{fps}</span>
        </div>

        {/* Frame Time */}
        <div className="flex items-center justify-between">
          <span className={`${labelColor}`}>Frame Time:</span>
          <span className={`${textColor}`}>
            {frameTime}
            <span className={`${labelColor} ml-0.5`}>ms</span>
          </span>
        </div>

        {/* Frame Drops */}
        <div className="flex items-center justify-between">
          <span className={`${labelColor}`}>Frame Drops:</span>
          <span className={`${textColor}`}>{frameDrops}</span>
        </div>

        {/* Tracking Status */}
        <div className="flex items-center justify-between">
          <span className={`${labelColor}`}>Tracking:</span>
          <span
            className={`${textColor} ${isTracking ? "text-blue-400" : labelColor}`}
          >
            {isTracking ? "Active" : "Idle"}
          </span>
        </div>
      </div>

      {/* Performance indicator bar */}
      <div
        className={`mt-2 h-1 w-full rounded-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${getStatusColor(
            fps
          )}`}
          style={{
            width: `${Math.min((fps / 60) * 100, 100)}%`,
          }}
        />
      </div>
    </div>
  );
}
