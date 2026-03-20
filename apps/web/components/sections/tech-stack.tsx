"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownWideNarrow,
  ArrowUpDown,
  ArrowUpNarrowWide,
  Bot,
  Code2,
  LayoutGrid,
  Monitor,
  Server,
} from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { TechDetailModal } from "@/components/modals/tech-detail-modal";
import { TechStackCategoryTabs } from "@/components/sections/tech-stack-category-tabs";
import { TechStackSearchSort } from "@/components/sections/tech-stack-search-sort";
import { SectionCard } from "@/components/shared/section-card";
import { TechStackItem } from "@/components/shared/tech-stack-item";
import { TECH_STACK } from "@/lib/constants/tech-stack";
import { useAnimationSkipContext } from "@/lib/contexts/animation-skip-context";
import { useAnimationSkipIndicator } from "@/lib/hooks/ui/use-animation-skip-indicator";
import { ProficiencyLevel, TechCategory } from "@/lib/types";

const CATEGORIES = [
  { label: "All", value: "All", icon: LayoutGrid },
  { label: "Frontend", value: "Frontend", icon: Monitor },
  { label: "Backend", value: "Backend", icon: Server },
  { label: "AI/ML", value: "AI/ML", icon: Bot },
  { label: "Language", value: "Language", icon: Code2 },
] as const;

const SORT_OPTIONS = [
  { label: "Featured", value: "default", icon: ArrowUpDown },
  {
    label: "Skill Level Desc",
    value: "proficiency-desc",
    icon: ArrowDownWideNarrow,
  },
  {
    label: "Skill Level Asc",
    value: "proficiency-asc",
    icon: ArrowUpNarrowWide,
  },
] as const;

const CATEGORY_MAP: Record<
  Exclude<(typeof CATEGORIES)[number]["value"], "All">,
  TechCategory[]
> = {
  Frontend: [
    TechCategory.FRONTEND,
    TechCategory.ANIMATION,
    TechCategory.STYLING,
    TechCategory.FRAMEWORK,
    TechCategory.MOBILE,
  ],
  Backend: [TechCategory.BACKEND, TechCategory.DATABASE, TechCategory.DEVOPS],
  "AI/ML": [TechCategory.AI_ML],
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
  type: "spring",
  bounce: 0.19,
  duration: 0.4,
} as const;

type CategoryFilter = (typeof CATEGORIES)[number]["value"];
type SortFilter = (typeof SORT_OPTIONS)[number]["value"];

export const TechStack = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("All");
  const [selectedSort, setSelectedSort] = useState<SortFilter>("default");
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const { skipAnimations } = useAnimationSkipContext();
  const showSkipIndicator = useAnimationSkipIndicator(skipAnimations);
  const [selectedTech, setSelectedTech] = useState<
    (typeof TECH_STACK)[0] | null
  >(null);

  const searchTerms = useMemo(
    () =>
      deferredSearchQuery
        .trim()
        .toLowerCase()
        .split(SEARCH_TERM_SPLIT_PATTERN)
        .filter(Boolean),
    [deferredSearchQuery]
  );

  const filteredStack = useMemo(() => {
    const filtered = TECH_STACK.filter((item) => {
      const matchesCategory =
        selectedCategory === "All"
          ? true
          : CATEGORY_MAP[selectedCategory].includes(
              item.category as TechCategory
            );

      const searchableText =
        `${item.name} ${item.category} ${item.proficiency ?? ""}`.toLowerCase();
      const matchesSearch =
        searchTerms.length === 0
          ? true
          : searchTerms.every((term) => searchableText.includes(term));

      return matchesCategory && matchesSearch;
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

  useEffect(() => {
    if (selectedTech) {
      document.body.dataset.skillsDialogOpen = "true";
    } else {
      delete document.body.dataset.skillsDialogOpen;
    }

    return () => {
      delete document.body.dataset.skillsDialogOpen;
    };
  }, [selectedTech]);

  const itemVariants = skipAnimations
    ? {
        initial: { opacity: 1, scale: 1, y: 0 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96, y: -8 },
      }
    : {
        initial: { opacity: 0, scale: 0.96, y: 18 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96, y: -12 },
      };

  return (
    <>
      <SectionCard id="skills" title="Stacks & Skills">
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
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
            layout
            transition={skipAnimations ? { duration: 0 } : TAB_TRANSITION}
          >
            <AnimatePresence mode="popLayout">
              {filteredStack.map((stack) => (
                <motion.div
                  {...itemVariants}
                  key={stack.name}
                  layout
                  transition={
                    skipAnimations
                      ? { duration: 0 }
                      : {
                          duration: 0.18,
                          ease: [0.22, 1, 0.36, 1],
                        }
                  }
                >
                  <TechStackItem
                    onClick={() => setSelectedTech(stack)}
                    searchTerms={searchTerms}
                    stack={stack}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
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
          </motion.div>

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
        <TechDetailModal
          isOpen={!!selectedTech}
          onClose={() => setSelectedTech(null)}
          tech={selectedTech}
        />
      )}
    </>
  );
};
