"use client";

import { useEffect } from "react";

import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";

export const SmoothScroll = ({
  children,
  enabled = true,
}: {
  children: React.ReactNode;
  enabled?: boolean;
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!enabled) {
      document.documentElement.style.scrollBehavior = "auto";
      return;
    }

    document.documentElement.style.scrollBehavior = prefersReducedMotion
      ? "auto"
      : "smooth";

    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, [enabled, prefersReducedMotion]);

  return children;
};
