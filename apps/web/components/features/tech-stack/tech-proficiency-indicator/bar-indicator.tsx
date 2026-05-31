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
      <div
        aria-label={`${config.label} proficiency: ${percentage}%`}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={percentage}
        className={cn(
          "w-full overflow-hidden rounded-full bg-muted",
          barSizeClass[size]
        )}
        role="progressbar"
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ backgroundColor: config.barColor, width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
