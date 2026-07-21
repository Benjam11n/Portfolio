"use client";

import { useMemo } from "react";

import { ExperienceMobileToggle } from "@/components/features/experience/experience-item/experience-mobile-toggle";
import { ExperiencePoints } from "@/components/features/experience/experience-item/experience-points";
import { ExperienceSummary } from "@/components/features/experience/experience-item/experience-summary";
import { useExperienceExpand } from "@/components/features/experience/experience-item/use-experience-expand";
import {
  getExperienceAriaIds,
  getExperienceDurationLabel,
} from "@/components/features/experience/experience-item/utils";
import { Card3D } from "@/components/shared/effects/card-3d";
import { useShouldReduceMotion } from "@/lib/hooks/performance/use-should-reduce-motion";
import { useMobileDetection } from "@/lib/hooks/utils/use-mobile-detection";
import type { Experience } from "@/lib/types";

interface ExperienceItemProps {
  item: Experience;
}

export const ExperienceItem = ({ item }: ExperienceItemProps) => {
  const shouldReduceMotion = useShouldReduceMotion();
  const isMobile = useMobileDetection();
  const hasPoints = item.points.length > 0;
  const durationLabel = getExperienceDurationLabel(item);
  const ids = useMemo(() => getExperienceAriaIds(item.id), [item.id]);
  const expand = useExperienceExpand({ shouldReduceMotion });

  const summary = (
    <ExperienceSummary
      durationLabel={durationLabel}
      hasPoints={hasPoints}
      headingId={ids.headingId}
      isOpen={expand.isOpen}
      item={item}
      shouldReduceMotion={shouldReduceMotion}
    />
  );

  if (!hasPoints) {
    return (
      <Card3D className="p-4" variant="text">
        <div className="group">{summary}</div>
      </Card3D>
    );
  }

  return (
    <Card3D className="shadow-sm" variant="text">
      <button
        aria-controls={ids.contentId}
        aria-expanded={expand.isOpen}
        aria-labelledby={ids.headingId}
        className="group block w-full cursor-pointer p-4 text-left transition-transform hover:scale-[1.005]"
        data-hover-cursor=""
        data-hover-cursor-label={expand.isOpen ? "" : "Click me!"}
        onClick={expand.handleButtonClick}
        onKeyDown={expand.handleButtonKeyDown}
        ref={expand.triggerRef}
        tabIndex={0}
        type="button"
      >
        {summary}
        {isMobile && <ExperienceMobileToggle isOpen={expand.isOpen} />}
        <ExperiencePoints
          contentId={ids.contentId}
          contentRef={expand.contentRef}
          item={item}
        />
      </button>
    </Card3D>
  );
};
