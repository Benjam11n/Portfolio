import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { TAB_TRANSITION } from "@/components/sections/tech-stack/constants";
import { Button } from "@/components/ui/button";

interface TechStackVisibilityToggleProps {
  hiddenTechCount: number;
  onToggle: () => void;
  showAllTech: boolean;
  skipAnimations: boolean;
}

export const TechStackVisibilityToggle = ({
  hiddenTechCount,
  onToggle,
  showAllTech,
  skipAnimations,
}: TechStackVisibilityToggleProps) => (
  <motion.div
    className="flex justify-center pt-1"
    layout
    transition={skipAnimations ? { duration: 0 } : TAB_TRANSITION}
  >
    <Button
      aria-expanded={showAllTech}
      className="h-9 rounded-full px-4 shadow-sm"
      onClick={onToggle}
      type="button"
    >
      <span className="flex items-center gap-2">
        <motion.span
          animate={{ opacity: 1, y: 0 }}
          initial={false}
          key={showAllTech ? "less" : "more"}
          transition={
            skipAnimations
              ? { duration: 0 }
              : { duration: 0.18, ease: [0.22, 1, 0.36, 1] }
          }
        >
          {showAllTech
            ? "See less"
            : `See more${hiddenTechCount > 0 ? ` (${hiddenTechCount})` : ""}`}
        </motion.span>
        <motion.span
          animate={{ rotate: showAllTech ? 180 : 0 }}
          transition={
            skipAnimations
              ? { duration: 0 }
              : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
          }
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </motion.span>
      </span>
    </Button>
  </motion.div>
);
