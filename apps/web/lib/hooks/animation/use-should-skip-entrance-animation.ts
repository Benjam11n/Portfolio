"use client";

import { useState } from "react";

interface UseShouldSkipEntranceAnimationOptions {
  thresholdMs?: number;
}

export const useShouldSkipEntranceAnimation = ({
  thresholdMs = 1200,
}: UseShouldSkipEntranceAnimationOptions = {}): boolean => {
  const [shouldSkipEntranceAnimation] = useState(() => {
    if (typeof window === "undefined" || typeof performance === "undefined") {
      return false;
    }

    return performance.now() > thresholdMs;
  });

  return shouldSkipEntranceAnimation;
};
