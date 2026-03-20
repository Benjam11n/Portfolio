"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { startTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TechStackSortOption<T extends string> = {
  label: string;
  value: T;
  icon: React.ComponentType<{ className?: string }>;
};

type TechStackSearchSortProps<T extends string> = {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  sortOptions: readonly TechStackSortOption<T>[];
  selectedSort: T;
  onSelectSort: (value: T) => void;
  skipAnimations?: boolean;
};

export function TechStackSearchSort<T extends string>({
  searchQuery,
  onSearchQueryChange,
  sortOptions,
  selectedSort,
  onSelectSort,
  skipAnimations = false,
}: TechStackSearchSortProps<T>) {
  const activeSortOption =
    sortOptions.find((option) => option.value === selectedSort) ??
    sortOptions[0];
  const ActiveSortIcon = activeSortOption.icon;

  let sortRotation = 0;
  if (selectedSort === ("proficiency-asc" as T)) {
    sortRotation = 90;
  } else if (selectedSort === ("proficiency-desc" as T)) {
    sortRotation = -90;
  }

  const cycleSort = () => {
    const activeIndex = sortOptions.findIndex(
      (option) => option.value === selectedSort
    );

    const safeActiveIndex = activeIndex === -1 ? 0 : activeIndex;
    const nextOption = sortOptions[(safeActiveIndex + 1) % sortOptions.length];

    startTransition(() => {
      onSelectSort(nextOption.value);
    });
  };

  return (
    <div className="w-full">
      <div className="flex w-full items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search technologies"
            className="pl-10"
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Search by name, category, or level"
            type="text"
            value={searchQuery}
          />
        </div>

        <Button
          aria-label={`Sort skills: ${activeSortOption.label}`}
          className="h-11 w-11 rounded-md border border-border/50 bg-background/70 text-muted-foreground shadow-sm transition-[transform,color,border-color,background-color] duration-200 hover:border-border hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
          onClick={cycleSort}
          size="icon"
          title={`Sort: ${activeSortOption.label}`}
          type="button"
          variant="outline"
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
        </Button>
      </div>
    </div>
  );
}
