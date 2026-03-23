"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface UseActiveSectionOptions {
  threshold?: number[];
  rootMargin?: string;
}

export const useActiveSection = (
  sectionIds: string[],
  options: UseActiveSectionOptions = {}
): string | null => {
  const {
    threshold = [0, 0.25, 0.5, 0.75, 1],
    rootMargin = "-40% 0px -40% 0px",
  } = options;

  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const initialSectionId = sectionIds[0] ?? null;

  // Use ref to persist sectionRatios across re-renders
  const sectionRatiosRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (initialSectionId) {
      setActiveSection(initialSectionId);
    }
  }, [initialSectionId, pathname]);

  useEffect(() => {
    if (sectionIds.length === 0) {
      return;
    }

    // Initialize or reset section ratios when sectionIds change
    sectionRatiosRef.current = new Map<string, number>();
    for (const id of sectionIds) {
      sectionRatiosRef.current.set(id, 0);
    }

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        const sectionId = entry.target.id;
        if (entry.isIntersecting) {
          sectionRatiosRef.current.set(sectionId, entry.intersectionRatio);
        } else {
          sectionRatiosRef.current.set(sectionId, 0);
        }
      }

      // Find the section with the highest intersection ratio
      let maxRatio = 0;
      let mostVisibleSection: string | null = null;

      for (const [sectionId, ratio] of sectionRatiosRef.current) {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          mostVisibleSection = sectionId;
        }
      }

      // Only update if the max ratio is significant (> 0)
      // This prevents flickering and ensures accurate section detection
      if (maxRatio > 0 && mostVisibleSection) {
        setActiveSection(mostVisibleSection);
      }
      // If maxRatio is 0, keep the current active section to prevent
      // jumps during smooth scrolling transitions between sections
    };

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin,
      threshold,
    });

    // Observe all sections
    for (const id of sectionIds) {
      const element = document.querySelector(`#${id}`);
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
