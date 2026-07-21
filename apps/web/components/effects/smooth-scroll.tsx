"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

import { useShouldReduceMotion } from "@/lib/hooks/performance/use-should-reduce-motion";

export interface SmoothScrollProps {
  children: ReactNode;
  enabled?: boolean;
}

export const SmoothScroll = ({
  children,
  enabled = true,
}: SmoothScrollProps) => {
  const shouldReduceMotion = useShouldReduceMotion();

  useEffect(() => {
    if (!enabled) {
      document.documentElement.style.scrollBehavior = "auto";
      return;
    }

    document.documentElement.style.scrollBehavior = shouldReduceMotion
      ? "auto"
      : "smooth";

    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, [enabled, shouldReduceMotion]);

  return children;
};
