import { domAnimation, LazyMotion, m } from "framer-motion";
import type { Transition } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { TAB_TRANSITION } from "@/components/features/tech-stack/constants";
import { Button } from "@/components/ui/button";

interface TechStackVisibilityToggleProps {
  hiddenTechCount: number;
  onToggle: () => void;
  showAllTech: boolean;
  skipAnimations: boolean;
}

const ZERO_DURATION: Transition = { duration: 0 };
const LABEL_TRANSITION: Transition = {
  duration: 0.18,
  ease: [0.22, 1, 0.36, 1],
};
const ICON_TRANSITION: Transition = {
  duration: 0.22,
  ease: [0.22, 1, 0.36, 1],
};

const getTransition = (
  skipAnimations: boolean,
  transition: Transition
): Transition => {
  if (skipAnimations) {
    return ZERO_DURATION;
  }

  return transition;
};

const getToggleLabel = (showAllTech: boolean, hiddenTechCount: number) => {
  if (showAllTech) {
    return "See less";
  }

  if (hiddenTechCount === 0) {
    return "See more";
  }

  return `See more (${hiddenTechCount})`;
};

const getLabelKey = (showAllTech: boolean) => {
  if (showAllTech) {
    return "less";
  }

  return "more";
};

const getIconRotation = (showAllTech: boolean) => {
  if (showAllTech) {
    return 180;
  }

  return 0;
};

export const TechStackVisibilityToggle = ({
  hiddenTechCount,
  onToggle,
  showAllTech,
  skipAnimations,
}: TechStackVisibilityToggleProps) => {
  const motionTransition = getTransition(skipAnimations, TAB_TRANSITION);
  const labelTransition = getTransition(skipAnimations, LABEL_TRANSITION);
  const iconTransition = getTransition(skipAnimations, ICON_TRANSITION);

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className="flex justify-center pt-1"
        layout
        transition={motionTransition}
      >
        <Button
          aria-expanded={showAllTech}
          className="h-9 rounded-full px-4 shadow-sm"
          onClick={onToggle}
          type="button"
        >
          <span className="flex items-center gap-2">
            <m.span
              animate={{ opacity: 1, y: 0 }}
              initial={false}
              key={getLabelKey(showAllTech)}
              transition={labelTransition}
            >
              {getToggleLabel(showAllTech, hiddenTechCount)}
            </m.span>
            <m.span
              animate={{ rotate: getIconRotation(showAllTech) }}
              transition={iconTransition}
            >
              <ChevronDown className="size-3.5" />
            </m.span>
          </span>
        </Button>
      </m.div>
    </LazyMotion>
  );
};
