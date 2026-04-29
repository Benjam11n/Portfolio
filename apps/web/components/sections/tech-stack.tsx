"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownWideNarrow,
  ArrowUpDown,
  ArrowUpNarrowWide,
  Bot,
  ChevronDown,
  Code2,
  LayoutGrid,
  Monitor,
  Server,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useDeferredValue, useMemo, useState } from "react";

import { TechStackCategoryTabs } from "@/components/sections/tech-stack-category-tabs";
import { TechStackSearchSort } from "@/components/sections/tech-stack-search-sort";
import { SectionCard } from "@/components/shared/section-card";
import { TechStackItem } from "@/components/shared/tech-stack-item";
import { Button } from "@/components/ui/button";
import { TECH_STACK } from "@/lib/constants/tech-stack";
import { useAnimationSkipContext } from "@/lib/contexts/animation-skip-context";
import { useAnimationSkipIndicator } from "@/lib/hooks/ui/use-animation-skip-indicator";
import { ProficiencyLevel, TechCategory } from "@/lib/types";

const DEFAULT_VISIBLE_TECH_COUNT = 12;
const BLURRED_COLLAPSED_TECH_COUNT = 2;

const DynamicTechDetailModal = dynamic(
  async () => {
    const mod = await import("@/components/modals/tech-detail-modal");
    return mod.TechDetailModal;
  },
  {
    loading: () => null,
    ssr: false,
  }
);

const CATEGORIES = [
  { icon: LayoutGrid, label: "All", value: "All" },
  { icon: Monitor, label: "Frontend", value: "Frontend" },
  { icon: Server, label: "Backend", value: "Backend" },
  { icon: Bot, label: "AI/ML", value: "AI/ML" },
  { icon: Code2, label: "Language", value: "Language" },
] as const;

const SORT_OPTIONS = [
  { icon: ArrowUpDown, label: "Featured", value: "default" },
  {
    icon: ArrowDownWideNarrow,
    label: "Skill Level Desc",
    value: "proficiency-desc",
  },
  {
    icon: ArrowUpNarrowWide,
    label: "Skill Level Asc",
    value: "proficiency-asc",
  },
] as const;

const CATEGORY_MAP: Record<
  Exclude<(typeof CATEGORIES)[number]["value"], "All">,
  TechCategory[]
> = {
  "AI/ML": [TechCategory.AI_ML],
  Backend: [TechCategory.BACKEND, TechCategory.DATABASE, TechCategory.DEVOPS],
  Frontend: [
    TechCategory.FRONTEND,
    TechCategory.ANIMATION,
    TechCategory.STYLING,
    TechCategory.FRAMEWORK,
    TechCategory.MOBILE,
  ],
  Language: [TechCategory.LANGUAGE],
};

const PROFICIENCY_RANK: Record<ProficiencyLevel, number> = {
  [ProficiencyLevel.BEGINNER]: 0,
  [ProficiencyLevel.INTERMEDIATE]: 1,
  [ProficiencyLevel.ADVANCED]: 2,
  [ProficiencyLevel.EXPERT]: 3,
};

const SEARCH_TERM_SPLIT_PATTERN = /\s+/;

const TAB_TRANSITION = {
  bounce: 0.19,
  duration: 0.4,
  type: "spring",
} as const;

type CategoryFilter = (typeof CATEGORIES)[number]["value"];
type SortFilter = (typeof SORT_OPTIONS)[number]["value"];
type TechStackItemData = (typeof TECH_STACK)[number];

interface SelectableTechStackItemProps {
  searchTerms: string[];
  stack: TechStackItemData;
  onSelect: (stack: TechStackItemData) => void;
}

interface VisibilityToggleProps {
  hiddenTechCount: number;
  onToggle: () => void;
  showAllTech: boolean;
  skipAnimations: boolean;
}

const getItemMotionProps = (index: number, skipAnimations: boolean) => {
  if (skipAnimations) {
    return {
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.98, y: -6 },
      initial: { opacity: 1, scale: 1, y: 0 },
      transition: { duration: 0 },
    };
  }

  const isOverflowItem = index >= DEFAULT_VISIBLE_TECH_COUNT;
  const overflowIndex = Math.max(index - DEFAULT_VISIBLE_TECH_COUNT, 0);

  return {
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      y: -10,
    },
    initial: {
      opacity: isOverflowItem ? 0 : 1,
      scale: isOverflowItem ? 0.96 : 1,
      y: isOverflowItem ? 14 : 0,
    },
    transition: {
      delay: isOverflowItem ? overflowIndex * 0.024 : 0,
      duration: 0.22,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  };
};

const SelectableTechStackItem = ({
  searchTerms,
  stack,
  onSelect,
}: SelectableTechStackItemProps) => {
  const handleClick = useCallback(() => {
    onSelect(stack);
  }, [onSelect, stack]);

  return (
    <TechStackItem
      onClick={handleClick}
      searchTerms={searchTerms}
      stack={stack}
    />
  );
};

const VisibilityToggle = ({
  hiddenTechCount,
  onToggle,
  showAllTech,
  skipAnimations,
}: VisibilityToggleProps) => (
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

export const TechStack = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("All");
  const [selectedSort, setSelectedSort] = useState<SortFilter>("default");
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const { skipAnimations } = useAnimationSkipContext();
  const showSkipIndicator = useAnimationSkipIndicator(skipAnimations);
  const [selectedTech, setSelectedTech] = useState<TechStackItemData | null>(
    null
  );
  const [expandedViewKey, setExpandedViewKey] = useState<string | null>(null);

  const normalizedSearchQuery = deferredSearchQuery.trim().toLowerCase();
  const searchTerms = useMemo(
    () =>
      normalizedSearchQuery.split(SEARCH_TERM_SPLIT_PATTERN).filter(Boolean),
    [normalizedSearchQuery]
  );
  const currentViewKey = `${selectedCategory}:${selectedSort}:${normalizedSearchQuery}`;

  const filteredStack = useMemo(() => {
    const filtered = TECH_STACK.filter((item) => {
      if (
        selectedCategory !== "All" &&
        !CATEGORY_MAP[selectedCategory].includes(item.category as TechCategory)
      ) {
        return false;
      }

      if (searchTerms.length === 0) {
        return true;
      }

      const searchableText =
        `${item.name} ${item.category} ${item.proficiency ?? ""}`.toLowerCase();

      return searchTerms.every((term) => searchableText.includes(term));
    });

    if (selectedSort === "default") {
      return filtered;
    }

    return [...filtered].sort((left, right) => {
      const leftRank = left.proficiency
        ? PROFICIENCY_RANK[left.proficiency]
        : -1;
      const rightRank = right.proficiency
        ? PROFICIENCY_RANK[right.proficiency]
        : -1;

      if (leftRank === rightRank) {
        return left.name.localeCompare(right.name);
      }

      return selectedSort === "proficiency-desc"
        ? rightRank - leftRank
        : leftRank - rightRank;
    });
  }, [searchTerms, selectedCategory, selectedSort]);

  const showAllTech = expandedViewKey === currentViewKey;

  const visibleStack = useMemo(
    () =>
      showAllTech
        ? filteredStack
        : filteredStack.slice(0, DEFAULT_VISIBLE_TECH_COUNT),
    [filteredStack, showAllTech]
  );
  const hiddenTechCount = Math.max(
    filteredStack.length - DEFAULT_VISIBLE_TECH_COUNT,
    0
  );
  const canToggleVisibleTech = hiddenTechCount > 0 || showAllTech;

  const handleCloseTechDetail = useCallback(() => {
    setSelectedTech(null);
  }, []);

  const handleSelectTech = useCallback((stack: TechStackItemData) => {
    setSelectedTech(stack);
  }, []);

  const toggleVisibleTech = useCallback(() => {
    setExpandedViewKey((current) =>
      current === currentViewKey ? null : currentViewKey
    );
  }, [currentViewKey]);

  return (
    <>
      <SectionCard
        className="relative isolate overflow-hidden"
        id="skills"
        title="Stacks & Skills"
      >
        <div className="space-y-6">
          {/* Controls */}
          <div className="space-y-4">
            {/* Categories */}
            <TechStackCategoryTabs
              onChange={setSelectedCategory}
              options={CATEGORIES}
              value={selectedCategory}
            />

            <TechStackSearchSort
              onSearchQueryChange={setSearchQuery}
              onSelectSort={setSelectedSort}
              searchQuery={searchQuery}
              selectedSort={selectedSort}
              skipAnimations={skipAnimations}
              sortOptions={SORT_OPTIONS}
            />
          </div>

          {/* Grid */}
          <motion.div
            className="relative overflow-hidden"
            layout
            transition={skipAnimations ? { duration: 0 } : TAB_TRANSITION}
          >
            <motion.div
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
              layout
              transition={skipAnimations ? { duration: 0 } : TAB_TRANSITION}
            >
              <AnimatePresence initial={false} mode="popLayout">
                {visibleStack.map((stack: TechStackItemData, index: number) => {
                  const motionProps = getItemMotionProps(index, skipAnimations);
                  const isBlurredCollapsedItem =
                    !showAllTech &&
                    hiddenTechCount > 0 &&
                    index >=
                      DEFAULT_VISIBLE_TECH_COUNT - BLURRED_COLLAPSED_TECH_COUNT;

                  return (
                    <motion.div
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
                        onSelect={handleSelectTech}
                        searchTerms={searchTerms}
                        stack={stack}
                      />
                    </motion.div>
                  );
                })}
                {filteredStack.length === 0 && (
                  <motion.p
                    animate={{ opacity: 1, y: 0 }}
                    className="col-span-full py-8 text-center text-muted-foreground text-sm"
                    initial={{
                      opacity: skipAnimations ? 1 : 0,
                      y: skipAnimations ? 0 : 10,
                    }}
                    layout
                  >
                    No technologies found.
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <AnimatePresence>
              {!showAllTech && hiddenTechCount > 0 && (
                <motion.div
                  animate={{ opacity: 1 }}
                  aria-hidden="true"
                  className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-24 cursor-default bg-background/60 backdrop-blur-[2px] md:h-32"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to top, black 10%, transparent 80%)",
                    maskImage:
                      "linear-gradient(to top, black 10%, transparent 80%)",
                  }}
                  transition={
                    skipAnimations
                      ? { duration: 0 }
                      : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
                  }
                />
              )}
            </AnimatePresence>
          </motion.div>

          {canToggleVisibleTech && (
            <VisibilityToggle
              hiddenTechCount={hiddenTechCount}
              onToggle={toggleVisibleTech}
              showAllTech={showAllTech}
              skipAnimations={skipAnimations}
            />
          )}

          {/* Skip Indicator */}
          {showSkipIndicator && (
            <div className="fade-in animate-in text-muted-foreground text-sm opacity-0 duration-300">
              Animations skipped
            </div>
          )}
        </div>
      </SectionCard>

      {/* Tech Detail Modal */}
      {selectedTech && (
        <DynamicTechDetailModal
          isOpen={!!selectedTech}
          onClose={handleCloseTechDetail}
          tech={selectedTech}
        />
      )}
    </>
  );
};
