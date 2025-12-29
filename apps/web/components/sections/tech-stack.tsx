"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { SectionCard } from "@/components/shared/section-card";
import { TechStackItem } from "@/components/shared/tech-stack-item";
import { TECH_STACK } from "@/constants/tech-stack";
import { cn } from "@/lib/utils";
import { TechCategory } from "@/types";

const CATEGORIES = ["All", "Frontend", "Backend", "AI/ML", "Language"];

export const TechStack = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

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
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                initial={{ opacity: 0, scale: 0.8 }}
                key={stack.name}
                layout
                transition={{ duration: 0.2 }}
              >
                <TechStackItem stack={stack} />
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredStack.length === 0 && (
            <motion.p
              animate={{ opacity: 1 }}
              className="col-span-full py-8 text-center text-muted-foreground text-sm"
              initial={{ opacity: 0 }}
            >
              No technologies found.
            </motion.p>
          )}
        </motion.div>
      </div>
    </SectionCard>
  );
};
