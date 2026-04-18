"use client";

import { useCallback, useEffect, useState } from "react";

export const useAnimationSkip = (): {
  skipAnimations: boolean;
  setSkipAnimations: (value: boolean) => void;
  resetSkipAnimations: () => void;
} => {
  const [skipAnimations, setSkipAnimationsState] = useState(false);

  const setSkipAnimations = useCallback((value: boolean) => {
    setSkipAnimationsState(value);
  }, []);

  const resetSkipAnimations = useCallback(() => {
    setSkipAnimationsState(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.repeat && event.key === "Escape") {
        setSkipAnimationsState((current) => !current);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return {
    resetSkipAnimations,
    setSkipAnimations,
    skipAnimations,
  };
};
