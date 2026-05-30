"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";

export interface SmoothScrollProps {
  children: ReactNode;
  enabled?: boolean;
}

export const SmoothScroll = ({
  children,
  enabled = true,
}: SmoothScrollProps) => {
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
