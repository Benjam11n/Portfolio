"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";

export const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // Apply smooth scroll behavior via CSS
    if (prefersReducedMotion) {
      document.documentElement.style.scrollBehavior = "auto";
    } else {
      document.documentElement.style.scrollBehavior = "smooth";
    }

    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, [prefersReducedMotion]);

  // Handle hash scrolling on mount or path change
  useEffect(() => {
    if (pathname === "/" && window.location.hash) {
      // Small timeout to ensure DOM is ready
      setTimeout(() => {
        const id = window.location.hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "start",
          });
        }
      }, 100);
    }
    // Scroll to top when navigating to new pages without hash
    else if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, prefersReducedMotion]);

  return <>{children}</>;
};
