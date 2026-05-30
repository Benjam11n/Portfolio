import { getStatusColor } from "@/components/shared/dev/performance-monitor/utils";

interface PerformanceBarProps {
  barColor: string;
  fps: number;
}

export const PerformanceBar = ({ barColor, fps }: PerformanceBarProps) => (
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
