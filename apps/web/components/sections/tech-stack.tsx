"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownWideNarrow,
  Blocks,
  Braces,
  BrainCircuit,
  Code2,
  Layers3,
  Search,
  Sparkles,
} from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { TechDetailModal } from "@/components/modals/tech-detail-modal";
import { SectionCard } from "@/components/shared/section-card";
import { TechStackItem } from "@/components/shared/tech-stack-item";
import { TECH_STACK } from "@/lib/constants/tech-stack";
import { useAnimationSkipContext } from "@/lib/contexts/animation-skip-context";
import { ProficiencyLevel, TechCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORY_FILTERS = [
  {
    label: "All",
    icon: Layers3,
    matches: null,
  },
  {
    label: "Frontend",
    icon: Sparkles,
    matches: [
      TechCategory.FRONTEND,
      TechCategory.ANIMATION,
      TechCategory.STYLING,
      TechCategory.FRAMEWORK,
      TechCategory.MOBILE,
    ],
  },
  {
    label: "Backend",
    icon: Blocks,
    matches: [TechCategory.BACKEND, TechCategory.DATABASE, TechCategory.DEVOPS],
  },
  {
    label: "AI/ML",
    icon: BrainCircuit,
    matches: [TechCategory.AI_ML],
  },
  {
    label: "Language",
    icon: Braces,
    matches: [TechCategory.LANGUAGE],
  },
] as const;

type CategoryFilter = {
  label: string;
  icon: (typeof CATEGORY_FILTERS)[number]["icon"];
  matches: readonly TechCategory[] | null;
};

const SORT_OPTIONS = [
  {
    label: "Featured",
    icon: Code2,
    value: "featured",
  },
  {
    label: "Skill Level",
    icon: ArrowDownWideNarrow,
    value: "proficiency",
  },
] as const;

const PROFICIENCY_ORDER: Record<ProficiencyLevel, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4,
};

type SortMode = (typeof SORT_OPTIONS)[number]["value"];

export const TechStack = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [sortMode, setSortMode] = useState<SortMode>("featured");
  const { skipAnimations } = useAnimationSkipContext();
  const [showSkipIndicator, setShowSkipIndicator] = useState(false);
  const [selectedTech, setSelectedTech] = useState<
    (typeof TECH_STACK)[0] | null
  >(null);

  const filteredStack = useMemo(() => {
    const selectedFilter = CATEGORY_FILTERS.find(
      (filter) => filter.label === selectedCategory
    ) as CategoryFilter | undefined;
    const normalizedQuery = deferredSearchQuery.trim().toLowerCase();
    const matchingItems = TECH_STACK.filter((item) => {
      const matchesCategory =
        !selectedFilter?.matches ||
        selectedFilter.matches.includes(item.category as TechCategory);

      const matchesSearch =
        !normalizedQuery ||
        [item.name, item.category, item.proficiency ?? ""].some((value) =>
          value.toLowerCase().includes(normalizedQuery)
        );

      return matchesCategory && matchesSearch;
    });

    if (sortMode !== "proficiency") {
      return matchingItems;
    }

    return [...matchingItems].sort((left, right) => {
      const proficiencyDelta =
        (PROFICIENCY_ORDER[right.proficiency ?? ProficiencyLevel.BEGINNER] ??
          0) -
        (PROFICIENCY_ORDER[left.proficiency ?? ProficiencyLevel.BEGINNER] ?? 0);

      if (proficiencyDelta !== 0) {
        return proficiencyDelta;
      }

      return left.name.localeCompare(right.name);
    });
  }, [deferredSearchQuery, selectedCategory, sortMode]);

  const selectedFilter = CATEGORY_FILTERS.find(
    (filter) => filter.label === selectedCategory
  );
  const selectedSortOption = SORT_OPTIONS.find(
    (option) => option.value === sortMode
  );

  /**
   * TECH STACK ANIMATION TIMELINE
   * =============================
   * Total Duration: 0.15s per item (parallel rendering)
   * Trigger: User interaction (category/filter changes) + initial mount
   *
   * Breakdown:
   * Each item: 0.15s scale + fade transition (all items animate in parallel)
   * Layout animation: 0.15s (shared layout animation for reordering)
   *
   * Strategy: Fast, responsive transitions that feel instant.
   * Framer Motion's layout prop enables smooth position animations during filtering.
   */

  // Show skip indicator when animations are skipped via Escape key
  useEffect(() => {
    if (skipAnimations) {
      setShowSkipIndicator(true);
      const timer = setTimeout(() => {
        setShowSkipIndicator(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [skipAnimations]);

  /**
   * FILTER TRANSITION ANIMATION
   * ===========================
   * Purpose: Provides smooth, instant feedback when users filter or search
   *   through the technology stack. The scale and opacity transitions create
   *   a polished filtering experience that feels responsive and modern.
   *
   * Duration: 0.15s per item for all transitions.
   *   Very fast duration ensures the interface feels responsive and snappy.
   *   When animations are skipped, duration becomes 0 for instant updates.
   *   The AnimatePresence mode="popLayout" enables smooth exit animations
   *   combined with layout animations for seamless filtering.
   *
   * Implementation: Uses Framer Motion's variants system for declarative
   *   animation states. The layout prop enables automatic position animations
   *   when items are reordered due to filtering.
   *
   * Skipping: When animations are skipped, all variants start at their final
   *   state (opacity: 1, scale: 1) and transitions have 0 duration, making
   *   filter changes instant. This ensures users can quickly browse the
   *   technology stack without any animation delay.
   */
  // When animations are skipped, disable entrance animations
  const itemVariants = skipAnimations
    ? {
        initial: { opacity: 1, scale: 1 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.96 },
      }
    : {
        initial: { opacity: 0, scale: 0.92, y: 10 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.96, y: -8 },
      };

  const itemTransition = skipAnimations
    ? { duration: 0 }
    : {
        type: "spring" as const,
        stiffness: 340,
        damping: 28,
        mass: 0.7,
      };

  const pillTransition = skipAnimations
    ? { duration: 0 }
    : {
        type: "spring" as const,
        stiffness: 420,
        damping: 34,
        mass: 0.65,
      };

  return (
    <>
      <SectionCard title="Stacks & Skills">
        <div className="space-y-6">
          {/* Controls */}
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="space-y-3">
              <div className="flex flex-col gap-3">
                <div className="overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="inline-flex min-w-full gap-3 rounded-[28px] border border-border/60 bg-gradient-to-r from-background/95 via-background/90 to-secondary/70 p-2 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
                    <div className="inline-flex flex-1 gap-1 rounded-[22px] border border-border/50 bg-background/70 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.24)]">
                      {CATEGORY_FILTERS.map((category) => {
                        const Icon = category.icon;
                        const isActive = selectedCategory === category.label;

                        return (
                          <button
                            aria-pressed={isActive}
                            className={cn(
                              "relative inline-flex min-h-11 flex-1 items-center justify-center gap-2 overflow-hidden rounded-[18px] px-3 py-2 font-medium text-xs tracking-tight transition-colors duration-200",
                              isActive
                                ? "text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                            data-state={isActive ? "active" : "inactive"}
                            key={category.label}
                            onClick={() => setSelectedCategory(category.label)}
                            type="button"
                          >
                            {isActive && (
                              <motion.span
                                className="absolute inset-0 rounded-[18px] bg-secondary shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_12px_24px_rgba(15,23,42,0.12)]"
                                layoutId="tech-stack-active-filter"
                                transition={pillTransition}
                              />
                            )}
                            <span className="relative flex items-center gap-2">
                              <Icon className="h-3.5 w-3.5" />
                              {category.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="inline-flex gap-1 rounded-[22px] border border-border/50 bg-background/70 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.24)]">
                      {SORT_OPTIONS.map((option) => {
                        const Icon = option.icon;
                        const isActive = sortMode === option.value;

                        return (
                          <button
                            aria-pressed={isActive}
                            className={cn(
                              "relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-[18px] px-3 py-2 font-medium text-xs tracking-tight transition-colors duration-200",
                              isActive
                                ? "text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                            data-state={isActive ? "active" : "inactive"}
                            key={option.value}
                            onClick={() => setSortMode(option.value)}
                            type="button"
                          >
                            {isActive && (
                              <motion.span
                                className="absolute inset-0 rounded-[18px] bg-secondary shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_12px_24px_rgba(15,23,42,0.12)]"
                                layoutId="tech-stack-active-sort"
                                transition={pillTransition}
                              />
                            )}
                            <span className="relative flex items-center gap-2">
                              <Icon className="h-3.5 w-3.5" />
                              {option.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="rounded-full border border-border/60 bg-background/80 px-3 py-1 font-medium text-muted-foreground">
                    Showing {filteredStack.length} skill
                    {filteredStack.length === 1 ? "" : "s"}
                  </span>
                  <span className="rounded-full border border-border/60 bg-secondary/70 px-3 py-1 font-medium text-foreground">
                    {selectedFilter?.label ?? "All"}
                  </span>
                  <span className="rounded-full border border-border/60 bg-background/80 px-3 py-1 font-medium text-muted-foreground">
                    Sorted by {selectedSortOption?.label ?? "Featured"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Sparkles className="h-3.5 w-3.5" />
                <span>
                  Animated filters, sorting, and highlighted matches
                </span>
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-64">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                aria-label="Search tech stack"
                className="h-11 w-full rounded-2xl border border-border/60 bg-background/80 pr-4 pl-10 text-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools, categories, or skill level"
                type="text"
                value={searchQuery}
              />
            </div>
          </div>

          {/* Grid */}
          <motion.div
            className="grid grid-cols-1 gap-4 min-[460px]:grid-cols-2 xl:grid-cols-3"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredStack.map((stack) => (
                <motion.div
                  {...itemVariants}
                  key={stack.name}
                  layout
                  transition={itemTransition}
                >
                  <TechStackItem
                    highlightQuery={deferredSearchQuery}
                    onClick={() => setSelectedTech(stack)}
                    stack={stack}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredStack.length === 0 && (
              <motion.p
                animate={{ opacity: 1 }}
                className="col-span-full py-8 text-center text-muted-foreground text-sm"
                initial={{ opacity: skipAnimations ? 1 : 0 }}
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
