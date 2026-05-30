"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { AUTO_PAUSE_AFTER_MS } from "@/components/bits/dither/constants";

interface UseDitherControlsOptions {
  shouldDisableAnimation: boolean;
  setSkipAnimations: (skipAnimations: boolean) => void;
  skipAnimations: boolean;
}

const useActivityIdleState = (
  shouldDisableAnimation: boolean,
  isManuallyPaused: boolean
) => {
  const [isIdle, setIsIdle] = useState(false);
  const lastActivityRef = useRef<number>(Date.now());

  useEffect(() => {
    if (shouldDisableAnimation || isManuallyPaused) {
      return;
    }

    const handleActivity = () => {
      lastActivityRef.current = Date.now();
      if (isIdle) {
        setIsIdle(false);
      }
    };

    let throttleTimeout: number | null = null;
    const throttledActivity = () => {
      if (throttleTimeout) {
        return;
      }
      handleActivity();
      throttleTimeout = window.setTimeout(() => {
        throttleTimeout = null;
      }, 500);
    };

    window.addEventListener("mousemove", throttledActivity, { passive: true });
    window.addEventListener("keydown", throttledActivity, { passive: true });
    window.addEventListener("touchstart", throttledActivity, { passive: true });
    window.addEventListener("scroll", throttledActivity, { passive: true });

    const intervalId = window.setInterval(() => {
      if (Date.now() - lastActivityRef.current > AUTO_PAUSE_AFTER_MS) {
        setIsIdle(true);
      }
    }, 1000);

    return () => {
      window.removeEventListener("mousemove", throttledActivity);
      window.removeEventListener("keydown", throttledActivity);
      window.removeEventListener("touchstart", throttledActivity);
      window.removeEventListener("scroll", throttledActivity);
      window.clearInterval(intervalId);
      if (throttleTimeout) {
        window.clearTimeout(throttleTimeout);
      }
    };
  }, [isIdle, shouldDisableAnimation, isManuallyPaused]);

  const resetIdleTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    setIsIdle(false);
  }, []);

  return { isIdle, resetIdleTimer };
};

export const useDitherControls = ({
  shouldDisableAnimation,
  setSkipAnimations,
  skipAnimations,
}: UseDitherControlsOptions) => {
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const { isIdle, resetIdleTimer } = useActivityIdleState(
    shouldDisableAnimation,
    isManuallyPaused
  );

  const toggleManualPause = useCallback(() => {
    setIsManuallyPaused((prev) => {
      const nextState = !prev;
      if (!nextState) {
        resetIdleTimer();
      }
      return nextState;
    });
  }, [resetIdleTimer]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        toggleManualPause();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleManualPause]);

  const handleContainerClick = useCallback(() => {
    if (skipAnimations) {
      setSkipAnimations(false);
      setIsManuallyPaused(false);
      resetIdleTimer();
      return;
    }

    toggleManualPause();
  }, [resetIdleTimer, setSkipAnimations, skipAnimations, toggleManualPause]);

  return {
    handleContainerClick,
    isEffectivelyPaused: shouldDisableAnimation || isManuallyPaused || isIdle,
  };
};
