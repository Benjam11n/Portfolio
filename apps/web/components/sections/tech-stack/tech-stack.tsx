"use client";

import { TechStackControls } from "@/components/sections/tech-stack/tech-stack-controls";
import { TechStackDetailModal } from "@/components/sections/tech-stack/tech-stack-detail-modal";
import { TechStackGrid } from "@/components/sections/tech-stack/tech-stack-grid";
import { TechStackSkipIndicator } from "@/components/sections/tech-stack/tech-stack-skip-indicator";
import { TechStackVisibilityToggle } from "@/components/sections/tech-stack/tech-stack-visibility-toggle";
import { useTechStackDetail } from "@/components/sections/tech-stack/use-tech-stack-detail";
import { useTechStackFilters } from "@/components/sections/tech-stack/use-tech-stack-filters";
import { SectionCard } from "@/components/shared/section-card";
import { useAnimationSkipContext } from "@/lib/contexts/animation-skip-context";
import { useAnimationSkipIndicator } from "@/lib/hooks/ui/use-animation-skip-indicator";

export const TechStack = () => {
  const { skipAnimations } = useAnimationSkipContext();
  const showSkipIndicator = useAnimationSkipIndicator(skipAnimations);
  const detail = useTechStackDetail();
  const filters = useTechStackFilters();

  return (
    <>
      <SectionCard
        className="relative isolate overflow-hidden"
        id="skills"
        title="Stacks & Skills"
      >
        <div className="space-y-6">
          <TechStackControls
            onSearchQueryChange={filters.handleSearchQueryChange}
            onSelectCategory={filters.handleSelectCategory}
            onSelectSort={filters.handleSelectSort}
            searchQuery={filters.searchQuery}
            selectedCategory={filters.selectedCategory}
            selectedSort={filters.selectedSort}
            skipAnimations={skipAnimations}
          />

          <TechStackGrid
            filteredCount={filters.filteredStack.length}
            hiddenTechCount={filters.hiddenTechCount}
            onSelectTech={detail.handleSelectTech}
            searchTerms={filters.searchTerms}
            showAllTech={filters.showAllTech}
            skipAnimations={skipAnimations}
            visibleStack={filters.visibleStack}
          />

          {filters.canToggleVisibleTech && (
            <TechStackVisibilityToggle
              hiddenTechCount={filters.hiddenTechCount}
              onToggle={filters.handleToggleVisibleTech}
              showAllTech={filters.showAllTech}
              skipAnimations={skipAnimations}
            />
          )}

          <TechStackSkipIndicator visible={showSkipIndicator} />
        </div>
      </SectionCard>

      <TechStackDetailModal
        onClose={detail.handleCloseTechDetail}
        selectedTech={detail.selectedTech}
      />
    </>
  );
};
