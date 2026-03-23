"use client";

import type { ProficiencyLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TechProficiencyIndicatorProps {
  proficiency: ProficiencyLevel;
  showLabel?: boolean;
  variant?: "dots" | "bar";
  size?: "sm" | "md" | "lg";
}

const proficiencyConfig = {
  advanced: {
    color: "bg-green-500",
    description: "Deep understanding",
    label: "Advanced",
    level: 3,
  },
  beginner: {
    color: "bg-yellow-500",
    description: "Familiar with basics",
    label: "Beginner",
    level: 1,
  },
  expert: {
    color: "bg-purple-500",
    description: "Mastery and leadership",
    label: "Expert",
    level: 4,
  },
  intermediate: {
    color: "bg-blue-500",
    description: "Comfortable with daily use",
    label: "Intermediate",
    level: 2,
  },
} as const satisfies Record<
  ProficiencyLevel,
  {
    level: number;
    label: string;
    color: string;
    description: string;
  }
>;

export const TechProficiencyIndicator = ({
  proficiency,
  showLabel = false,
  variant = "dots",
  size = "md",
}: TechProficiencyIndicatorProps) => {
  const config = proficiencyConfig[proficiency];

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center gap-1", showLabel && "gap-2")}>
        {showLabel && (
          <span
            className={cn(
              "font-medium text-muted-foreground text-xs",
              size === "sm" && "text-[10px]",
              size === "lg" && "text-sm"
            )}
          >
            {config.label}
          </span>
        )}
        <ul className="m-0 flex list-none gap-1 p-0">
          {[1, 2, 3, 4].map((level) => (
            <li
              className={cn(
                "rounded-full transition-colors",
                size === "sm" && "h-1.5 w-1.5",
                size === "md" && "h-2 w-2",
                size === "lg" && "h-2.5 w-2.5",
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
  }

  // Bar variant
  const percentage = (config.level / 4) * 100;

  return (
    <div className={cn("flex flex-col gap-1", showLabel && "gap-1.5")}>
      {showLabel && (
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "font-medium text-muted-foreground text-xs",
              size === "sm" && "text-[10px]",
              size === "lg" && "text-sm"
            )}
          >
            {config.label}
          </span>
          <span
            className={cn(
              "text-muted-foreground text-xs",
              size === "sm" && "text-[10px]",
              size === "lg" && "text-sm"
            )}
          >
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
          "relative h-2 w-full overflow-hidden rounded-full bg-muted",
          size === "sm" && "h-1.5",
          size === "lg" && "h-2.5"
        )}
        role="progressbar"
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            config.color
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
