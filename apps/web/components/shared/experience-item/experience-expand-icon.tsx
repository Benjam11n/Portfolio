import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

interface ExperienceExpandIconProps {
  isOpen: boolean;
}

export const ExperienceExpandIcon = ({ isOpen }: ExperienceExpandIconProps) => (
  <ChevronDown
    className={cn(
      "h-4 w-4 transition-transform duration-300",
      isOpen && "rotate-180"
    )}
  />
);
