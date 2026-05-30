"use client";

import { BarIndicator } from "@/components/features/tech-stack/tech-proficiency-indicator/bar-indicator";
import { proficiencyConfig } from "@/components/features/tech-stack/tech-proficiency-indicator/constants";
import { DotsIndicator } from "@/components/features/tech-stack/tech-proficiency-indicator/dots-indicator";
import type { ProficiencyLevel } from "@/lib/types";

interface TechProficiencyIndicatorProps {
  proficiency: ProficiencyLevel;
  showLabel?: boolean;
  variant?: "dots" | "bar";
  size?: "sm" | "md" | "lg";
}

export const TechProficiencyIndicator = ({
  proficiency,
  showLabel = false,
  variant = "dots",
  size = "md",
}: TechProficiencyIndicatorProps) => {
  const config = proficiencyConfig[proficiency];

  return variant === "dots" ? (
    <DotsIndicator config={config} showLabel={showLabel} size={size} />
  ) : (
    <BarIndicator config={config} showLabel={showLabel} size={size} />
  );
};
