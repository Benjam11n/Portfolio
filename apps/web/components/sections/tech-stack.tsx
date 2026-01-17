"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SectionCard } from "@/components/shared/section-card";
import { TechStackItem } from "@/components/shared/tech-stack-item";
import { TECH_STACK } from "@/lib/constants/tech-stack";
import { useAnimationSkipContext } from "@/lib/contexts/animation-skip-context";
import { TechCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Frontend", "Backend", "AI/ML", "Language"];

export const TechStack = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { skipAnimations } = useAnimationSkipContext();
  const [showSkipIndicator, setShowSkipIndicator] = useState(false);

  const filteredStack = useMemo(() => {
    return TECH_STACK.filter((item) => {
      // Category Filter
      let matchesCategory = true;
      if (selectedCategory !== "All") {
        const categoryMap: Record<string, TechCategory[]> = {
          Frontend: [
            TechCategory.FRONTEND,
            TechCategory.ANIMATION,
            TechCategory.STYLING,
            TechCategory.FRAMEWORK,
            TechCategory.MOBILE,
          ],
          Backend: [
            TechCategory.BACKEND,
            TechCategory.DATABASE,
            TechCategory.DEVOPS,
          ],
          "AI/ML": [TechCategory.AI_ML],
          Language: [TechCategory.LANGUAGE],
        };

        const validCategories = categoryMap[selectedCategory] || [];
        matchesCategory = validCategories.includes(
          item.category as TechCategory
        );
      }

      // Search Filter
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

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
        exit: { opacity: 0, scale: 0.8 },
      }
    : {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
      };

  return (
    <SectionCard title="Stacks & Skills">
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                className={cn(
                  "rounded-full px-3 py-1 font-medium text-xs transition-colors",
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                )}
                key={category}
                onClick={() => setSelectedCategory(category)}
                type="button"
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-48">
            <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className="h-8 w-full rounded-md border border-input bg-background pr-3 pl-8 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              type="text"
              value={searchQuery}
            />
          </div>
        </div>

        {/* Grid */}
        <motion.div className="grid grid-cols-1 gap-4 md:grid-cols-2" layout>
          <AnimatePresence mode="popLayout">
            {filteredStack.map((stack) => (
              <motion.div
                {...itemVariants}
                key={stack.name}
                layout
                transition={{ duration: skipAnimations ? 0 : 0.15 }}
              >
                <TechStackItem stack={stack} />
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
  );
};
