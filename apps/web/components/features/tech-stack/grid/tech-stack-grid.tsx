import { AnimatePresence, domAnimation, LazyMotion, m } from "framer-motion";

import {
  BLURRED_COLLAPSED_TECH_COUNT,
  DEFAULT_VISIBLE_TECH_COUNT,
  TAB_TRANSITION,
} from "@/components/features/tech-stack/constants";
import type { TechStackItemData } from "@/components/features/tech-stack/constants";
import { SelectableTechStackItem } from "@/components/features/tech-stack/grid/selectable-tech-stack-item";
import { TechStackEmptyState } from "@/components/features/tech-stack/grid/tech-stack-empty-state";
import { TechStackFadeOverlay } from "@/components/features/tech-stack/grid/tech-stack-fade-overlay";
import { getItemMotionProps } from "@/components/features/tech-stack/utils";

interface TechStackGridProps {
  filteredCount: number;
  hiddenTechCount: number;
  searchTerms: string[];
  showAllTech: boolean;
  skipAnimations: boolean;
  visibleStack: TechStackItemData[];
  onSelectTech: (stack: TechStackItemData) => void;
}

export const TechStackGrid = ({
  filteredCount,
  hiddenTechCount,
  searchTerms,
  showAllTech,
  skipAnimations,
  visibleStack,
  onSelectTech,
}: TechStackGridProps) => (
  <LazyMotion features={domAnimation}>
    <m.div
      className="relative overflow-hidden"
      layout
      transition={skipAnimations ? { duration: 0 } : TAB_TRANSITION}
    >
      <m.div
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
        layout
        transition={skipAnimations ? { duration: 0 } : TAB_TRANSITION}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {visibleStack.map((stack, index) => {
            const motionProps = getItemMotionProps(index, skipAnimations);
            const isBlurredCollapsedItem =
              !showAllTech &&
              hiddenTechCount > 0 &&
              index >=
                DEFAULT_VISIBLE_TECH_COUNT - BLURRED_COLLAPSED_TECH_COUNT;

            return (
              <m.div
                animate={motionProps.animate}
                className={
                  isBlurredCollapsedItem
                    ? "pointer-events-none select-none"
                    : undefined
                }
                exit={motionProps.exit}
                initial={motionProps.initial}
                key={stack.name}
                layout
                transition={motionProps.transition}
              >
                <SelectableTechStackItem
                  onSelect={onSelectTech}
                  searchTerms={searchTerms}
                  stack={stack}
                />
              </m.div>
            );
          })}
          {filteredCount === 0 && (
            <TechStackEmptyState skipAnimations={skipAnimations} />
          )}
        </AnimatePresence>
      </m.div>

      <AnimatePresence>
        {!showAllTech && hiddenTechCount > 0 && (
          <TechStackFadeOverlay skipAnimations={skipAnimations} />
        )}
      </AnimatePresence>
    </m.div>
  </LazyMotion>
);
