"use client";

import { useIsResourceConstrainedDevice } from "@/lib/hooks/performance/use-resource-constrained-device";
import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";

export const useShouldReduceEffects = () => {
  const isResourceConstrainedDevice = useIsResourceConstrainedDevice();
  const prefersReducedMotion = usePrefersReducedMotion();

  return isResourceConstrainedDevice || prefersReducedMotion;
};
