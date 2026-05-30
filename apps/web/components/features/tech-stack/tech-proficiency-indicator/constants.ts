import type { ProficiencyLevel } from "@/lib/types";

export type IndicatorSize = "sm" | "md" | "lg";

export interface ProficiencyConfig {
  level: number;
  label: string;
  color: string;
  description: string;
}

export const proficiencyConfig = {
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
} as const satisfies Record<ProficiencyLevel, ProficiencyConfig>;

export const labelSizeClass: Record<IndicatorSize, string> = {
  lg: "text-sm",
  md: "text-xs",
  sm: "text-[10px]",
};

export const dotSizeClass: Record<IndicatorSize, string> = {
  lg: "h-2.5 w-2.5",
  md: "h-2 w-2",
  sm: "h-1.5 w-1.5",
};

export const barSizeClass: Record<IndicatorSize, string> = {
  lg: "h-2.5",
  md: "h-2",
  sm: "h-1.5",
};
