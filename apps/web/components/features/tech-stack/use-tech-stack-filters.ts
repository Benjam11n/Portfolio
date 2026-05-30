"use client";

import { useCallback, useDeferredValue, useMemo, useState } from "react";

import { DEFAULT_VISIBLE_TECH_COUNT } from "@/components/features/tech-stack/constants";
import type {
  CategoryFilter,
  SortFilter,
} from "@/components/features/tech-stack/constants";
import {
  filterTechStack,
  getHiddenTechCount,
  getSearchTerms,
  getVisibleTechStack,
  sortTechStack,
} from "@/components/features/tech-stack/utils";
import { TECH_STACK } from "@/lib/constants/tech-stack";

export const useTechStackFilters = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("All");
  const [selectedSort, setSelectedSort] = useState<SortFilter>("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedViewKey, setExpandedViewKey] = useState<string | null>(null);
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const normalizedSearchQuery = deferredSearchQuery.trim().toLowerCase();

  const searchTerms = useMemo(
    () => getSearchTerms(normalizedSearchQuery),
    [normalizedSearchQuery]
  );
  const currentViewKey = `${selectedCategory}:${selectedSort}:${normalizedSearchQuery}`;

  const filteredStack = useMemo(() => {
    const filtered = filterTechStack({
      items: TECH_STACK,
      searchTerms,
      selectedCategory,
    });

    return sortTechStack(filtered, selectedSort);
  }, [searchTerms, selectedCategory, selectedSort]);

  const showAllTech = expandedViewKey === currentViewKey;
  const visibleStack = useMemo(
    () => getVisibleTechStack(filteredStack, showAllTech),
    [filteredStack, showAllTech]
  );
  const hiddenTechCount = getHiddenTechCount(filteredStack.length);
  const canToggleVisibleTech =
    hiddenTechCount > 0 ||
    (showAllTech && filteredStack.length > DEFAULT_VISIBLE_TECH_COUNT);

  const handleToggleVisibleTech = useCallback(() => {
    setExpandedViewKey((current) =>
      current === currentViewKey ? null : currentViewKey
    );
  }, [currentViewKey]);

  const handleSelectCategory = useCallback((category: CategoryFilter) => {
    setSelectedCategory(category);
  }, []);

  const handleSelectSort = useCallback((sort: SortFilter) => {
    setSelectedSort(sort);
  }, []);

  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return {
    canToggleVisibleTech,
    filteredStack,
    handleSearchQueryChange,
    handleSelectCategory,
    handleSelectSort,
    handleToggleVisibleTech,
    hiddenTechCount,
    searchQuery,
    searchTerms,
    selectedCategory,
    selectedSort,
    showAllTech,
    visibleStack,
  };
};
