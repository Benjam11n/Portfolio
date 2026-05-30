import {
  barSizeClass,
  labelSizeClass,
} from "@/components/features/tech-stack/tech-proficiency-indicator/constants";
import type {
  IndicatorSize,
  ProficiencyConfig,
} from "@/components/features/tech-stack/tech-proficiency-indicator/constants";
import { ProficiencyLabel } from "@/components/features/tech-stack/tech-proficiency-indicator/proficiency-label";
import { cn } from "@/lib/utils";

interface BarIndicatorProps {
  config: ProficiencyConfig;
  showLabel: boolean;
  size: IndicatorSize;
}

export const BarIndicator = ({
  config,
  showLabel,
  size,
}: BarIndicatorProps) => {
  const percentage = (config.level / 4) * 100;

  return (
    <div className={cn("flex flex-col gap-1", showLabel && "gap-1.5")}>
      {showLabel && (
        <div className="flex items-center justify-between">
          <ProficiencyLabel size={size}>{config.label}</ProficiencyLabel>
          <span className={cn("text-muted-foreground", labelSizeClass[size])}>
            {config.description}
          </span>
        </div>
      )}
      <progress
        aria-label={`${config.label} proficiency: ${percentage}%`}
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-muted [&::-moz-progress-bar]:bg-transparent [&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-value]:bg-transparent",
          barSizeClass[size]
        )}
        max={100}
        value={percentage}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            config.color
          )}
          style={{ width: `${percentage}%` }}
        />
      </progress>
    </div>
  );
};
