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
  Search,
  Server,
} from "lucide-react";
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import { TechDetailModal } from "@/components/modals/tech-detail-modal";
import { SectionCard } from "@/components/shared/section-card";
import { TechStackItem } from "@/components/shared/tech-stack-item";
import { TECH_STACK } from "@/lib/constants/tech-stack";
import { useAnimationSkipContext } from "@/lib/contexts/animation-skip-context";
import { useAnimationSkipIndicator } from "@/lib/hooks/ui/use-animation-skip-indicator";
import { ProficiencyLevel, TechCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

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
    label: "Skill Level Asc",
    value: "proficiency-asc",
    icon: ArrowUpNarrowWide,
  },
  {
    label: "Skill Level Desc",
    value: "proficiency-desc",
    icon: ArrowDownWideNarrow,
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
  stiffness: 420,
  damping: 32,
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
        initial: { opacity: 1, scale: 1, y: 0 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96, y: -8 },
      }
    : {
        initial: { opacity: 0, scale: 0.96, y: 18 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96, y: -12 },
      };

  const activeSortOption = SORT_OPTIONS.find(
    (option) => option.value === selectedSort
  );
  const ActiveSortIcon = activeSortOption?.icon ?? ArrowUpDown;
  let sortRotation = 0;

  if (selectedSort === "proficiency-asc") {
    sortRotation = 90;
  } else if (selectedSort === "proficiency-desc") {
    sortRotation = -90;
  }

  const cycleSort = () => {
    const activeIndex = SORT_OPTIONS.findIndex(
      (option) => option.value === selectedSort
    );
    const nextOption = SORT_OPTIONS[(activeIndex + 1) % SORT_OPTIONS.length];

    startTransition(() => {
      setSelectedSort(nextOption.value);
    });
  };

  return (
    <>
      <SectionCard id="skills" title="Stacks & Skills">
        <div className="space-y-6">
          {/* Controls */}
          <div className="space-y-4">
            {/* Categories */}
            <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="inline-flex w-fit min-w-max gap-1.5 rounded-[1.35rem] border border-border/70 bg-background/75 p-1.5 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.7)] backdrop-blur-md">
                {CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  const isActive = selectedCategory === category.value;

                  return (
                    <button
                      aria-pressed={isActive}
                      className={cn(
                        "relative isolate flex min-h-10 items-center gap-2 overflow-hidden rounded-2xl px-3.5 py-2 font-medium text-xs transition-colors duration-200 sm:text-sm",
                        isActive
                          ? "text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      key={category.value}
                      onClick={() => {
                        startTransition(() => {
                          setSelectedCategory(category.value);
                        });
                      }}
                      type="button"
                    >
                      {isActive && (
                        <motion.span
                          className="absolute inset-0 -z-10 rounded-2xl bg-primary shadow-[0_20px_40px_-24px_rgba(0,0,0,0.9)]"
                          layoutId="tech-stack-category-pill"
                          transition={
                            skipAnimations ? { duration: 0 } : TAB_TRANSITION
                          }
                        />
                      )}
                      {isActive && (
                        <motion.span
                          animate={{
                            opacity: 1,
                            scale: 1,
                          }}
                          className="absolute inset-[1px] -z-5 rounded-2xl border border-primary-foreground/10"
                          initial={
                            skipAnimations
                              ? { opacity: 1, scale: 1 }
                              : { opacity: 0.65, scale: 0.94 }
                          }
                          transition={
                            skipAnimations
                              ? { duration: 0 }
                              : {
                                  duration: 0.22,
                                  ease: [0.22, 1, 0.36, 1],
                                }
                          }
                        />
                      )}
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span>{category.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="w-full">
              <div className="flex w-full items-center gap-2 rounded-[1.35rem] border border-border/70 bg-background/75 p-1.5 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.7)] backdrop-blur-md">
                <div className="relative min-w-0 flex-1">
                  <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    aria-label="Search technologies"
                    className="h-11 w-full rounded-2xl bg-transparent pr-4 pl-10 text-sm ring-offset-background transition-[background-color,color] duration-200 placeholder:text-muted-foreground focus-visible:bg-background/70 focus-visible:outline-none"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, category, or level"
                    type="text"
                    value={searchQuery}
                  />
                </div>
                <button
                  aria-label={`Sort skills: ${activeSortOption?.label ?? "Featured"}`}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border/50 bg-background/70 text-muted-foreground shadow-sm transition-[transform,color,border-color,background-color] duration-200 hover:border-border hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
                  onClick={cycleSort}
                  title={`Sort: ${activeSortOption?.label ?? "Featured"}`}
                  type="button"
                >
                  <motion.span
                    animate={{ rotate: sortRotation }}
                    transition={
                      skipAnimations
                        ? { duration: 0 }
                        : { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
                    }
                  >
                    <ActiveSortIcon className="h-4 w-4" />
                  </motion.span>
                </button>
              </div>
            </div>
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
