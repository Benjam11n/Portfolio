"use client";

import "lenis/dist/lenis.css";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";

export const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // If user prefers reduced motion, don't enable smooth scrolling
    // This respects accessibility preferences and avoids motion sickness
    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [prefersReducedMotion]);

  // Handle hash scrolling on mount or path change
  useEffect(() => {
    if (pathname === "/" && window.location.hash) {
      // Small timeout to ensure DOM is ready and Lenis is initialized
      setTimeout(() => {
        const id = window.location.hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          // Use instant scroll if user prefers reduced motion
          element.scrollIntoView({
            behavior: prefersReducedMotion ? "instant" : "smooth",
          });
        }
      }, 500);
    }
    // Scroll to top only when navigating to projects routes or other new pages without hash
    else if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, prefersReducedMotion]);

  return <>{children}</>;
};
