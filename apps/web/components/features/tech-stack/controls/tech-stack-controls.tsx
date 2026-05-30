import {
  CATEGORIES,
  SORT_OPTIONS,
} from "@/components/features/tech-stack/constants";
import type {
  CategoryFilter,
  SortFilter,
} from "@/components/features/tech-stack/constants";
import { TechStackCategoryTabs } from "@/components/features/tech-stack/controls/tech-stack-category-tabs";
import { TechStackSearchSort } from "@/components/features/tech-stack/controls/tech-stack-search-sort";

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
