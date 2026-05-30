import { dotSizeClass } from "@/components/features/tech-stack/tech-proficiency-indicator/constants";
import type {
  IndicatorSize,
  ProficiencyConfig,
} from "@/components/features/tech-stack/tech-proficiency-indicator/constants";
import { ProficiencyLabel } from "@/components/features/tech-stack/tech-proficiency-indicator/proficiency-label";
import { cn } from "@/lib/utils";

interface DotsIndicatorProps {
  config: ProficiencyConfig;
  showLabel: boolean;
  size: IndicatorSize;
}

export const DotsIndicator = ({
  config,
  showLabel,
  size,
}: DotsIndicatorProps) => (
  <div className={cn("flex items-center gap-1", showLabel && "gap-2")}>
    {showLabel && (
      <ProficiencyLabel size={size}>{config.label}</ProficiencyLabel>
    )}
    <ul className="m-0 flex list-none gap-1 p-0">
      {[1, 2, 3, 4].map((level) => (
        <li
          className={cn(
            "rounded-full transition-colors",
            dotSizeClass[size],
            level <= config.level
              ? cn(config.color, "opacity-100")
              : "bg-muted opacity-30"
          )}
          key={level}
        />
      ))}
    </ul>
  </div>
);
