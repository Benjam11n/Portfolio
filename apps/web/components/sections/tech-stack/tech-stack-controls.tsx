import { TechStackCategoryTabs } from "@/components/sections/tech-stack-category-tabs";
import { TechStackSearchSort } from "@/components/sections/tech-stack-search-sort";
import {
  CATEGORIES,
  SORT_OPTIONS,
} from "@/components/sections/tech-stack/constants";
import type {
  CategoryFilter,
  SortFilter,
} from "@/components/sections/tech-stack/constants";

interface TechStackControlsProps {
  searchQuery: string;
  selectedCategory: CategoryFilter;
  selectedSort: SortFilter;
  skipAnimations: boolean;
  onSearchQueryChange: (query: string) => void;
  onSelectCategory: (category: CategoryFilter) => void;
  onSelectSort: (sort: SortFilter) => void;
}

export const TechStackControls = ({
  searchQuery,
  selectedCategory,
  selectedSort,
  skipAnimations,
  onSearchQueryChange,
  onSelectCategory,
  onSelectSort,
}: TechStackControlsProps) => (
  <div className="space-y-4">
    <TechStackCategoryTabs
      onChange={onSelectCategory}
      options={CATEGORIES}
      value={selectedCategory}
    />

    <TechStackSearchSort
      onSearchQueryChange={onSearchQueryChange}
      onSelectSort={onSelectSort}
      searchQuery={searchQuery}
      selectedSort={selectedSort}
      skipAnimations={skipAnimations}
      sortOptions={SORT_OPTIONS}
    />
  </div>
);
