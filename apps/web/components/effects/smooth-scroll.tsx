"use client";

import { useEffect } from "react";

import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";

export const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    document.documentElement.style.scrollBehavior = prefersReducedMotion
      ? "auto"
      : "smooth";

    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, [prefersReducedMotion]);

  return children;
};
