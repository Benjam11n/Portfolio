"use client";

import { useEffect, useState } from "react";

type UseActiveSectionOptions = {
  threshold?: number[];
  rootMargin?: string;
};

export const useActiveSection = (
  sectionIds: string[],
  options: UseActiveSectionOptions = {}
): string | null => {
  const {
    threshold = [0, 0.25, 0.5, 0.75, 1],
    rootMargin = "-40% 0px -40% 0px",
  } = options;

  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (sectionIds.length === 0) {
      return;
    }

    // Track intersection ratios for each section
    const sectionRatios = new Map<string, number>();

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        const sectionId = entry.target.id;
        if (entry.isIntersecting) {
          sectionRatios.set(sectionId, entry.intersectionRatio);
        } else {
          sectionRatios.set(sectionId, 0);
        }
      }

      // Find the section with the highest intersection ratio
      let maxRatio = 0;
      let mostVisibleSection: string | null = null;

      for (const [sectionId, ratio] of sectionRatios) {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          mostVisibleSection = sectionId;
        }
      }

      // Only update if the max ratio is significant (> 0)
      // This prevents flickering and ensures accurate section detection
      if (maxRatio > 0 && mostVisibleSection) {
        setActiveSection(mostVisibleSection);
      } else if (maxRatio === 0) {
        // If no section is significantly visible, we're at the top or bottom
        // Don't reset to null to avoid flickering to "nothing active" state
        // unless we want strict visibility.
        // For now, let's keep it mostly persistent.
      }
    };

    const observer = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin,
    });

    // Observe all sections
    for (const id of sectionIds) {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    }

    // Cleanup observer on unmount
    return () => {
      observer.disconnect();
    };
  }, [sectionIds, threshold, rootMargin]);

  return activeSection;
};
