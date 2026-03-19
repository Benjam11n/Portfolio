"use client";

import { useEffect, useRef, useState } from "react";

export function useAnimationSkipIndicator(
  isActive: boolean,
  duration = 2000
): boolean {
  const [showIndicator, setShowIndicator] = useState(false);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    if (!isActive) {
      setShowIndicator(false);
      return;
    }

    setShowIndicator(true);
    const timer = window.setTimeout(() => {
      setShowIndicator(false);
    }, duration);

    return () => window.clearTimeout(timer);
  }, [duration, isActive]);

  return showIndicator;
}
