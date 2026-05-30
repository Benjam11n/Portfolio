import {
  CATEGORY_MAP,
  DEFAULT_VISIBLE_TECH_COUNT,
  PROFICIENCY_RANK,
  SEARCH_TERM_SPLIT_PATTERN,
} from "@/components/features/tech-stack/constants";
import type {
  CategoryFilter,
  SortFilter,
  TechStackItemData,
} from "@/components/features/tech-stack/constants";
import type { TechCategory } from "@/lib/types";

interface TechStackFilterOptions {
  items: TechStackItemData[];
  searchTerms: string[];
  selectedCategory: CategoryFilter;
}

export const getSearchTerms = (searchQuery: string) =>
  searchQuery
    .trim()
    .toLowerCase()
    .split(SEARCH_TERM_SPLIT_PATTERN)
    .filter(Boolean);

export const filterTechStack = ({
  items,
  searchTerms,
  selectedCategory,
}: TechStackFilterOptions) =>
  items.filter((item) => {
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

export const sortTechStack = (
  items: TechStackItemData[],
  selectedSort: SortFilter
) => {
  if (selectedSort === "default") {
    return items;
  }

  return [...items].sort((left, right) => {
    const leftRank = left.proficiency ? PROFICIENCY_RANK[left.proficiency] : -1;
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
};

export const getVisibleTechStack = (
  filteredStack: TechStackItemData[],
  showAllTech: boolean
) =>
  showAllTech
    ? filteredStack
    : filteredStack.slice(0, DEFAULT_VISIBLE_TECH_COUNT);

export const getHiddenTechCount = (filteredStackLength: number) =>
  Math.max(filteredStackLength - DEFAULT_VISIBLE_TECH_COUNT, 0);

export const getItemMotionProps = (index: number, skipAnimations: boolean) => {
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
