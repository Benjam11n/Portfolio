import type { ReactNode } from "react";

import { labelSizeClass } from "@/components/features/tech-stack/tech-proficiency-indicator/constants";
import type { IndicatorSize } from "@/components/features/tech-stack/tech-proficiency-indicator/constants";
import { cn } from "@/lib/utils";

interface ProficiencyLabelProps {
  children: ReactNode;
  size: IndicatorSize;
}

export const ProficiencyLabel = ({ children, size }: ProficiencyLabelProps) => (
  <span
    className={cn("font-medium text-muted-foreground", labelSizeClass[size])}
  >
    {children}
  </span>
);
