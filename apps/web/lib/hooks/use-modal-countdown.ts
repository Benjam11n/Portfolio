"use client";

import { useEffect, useRef } from "react";

type UseModalCountdownOptions = {
  /** Duration in milliseconds before the callback is triggered */
  duration: number;
  /** Callback to execute when countdown completes */
  onComplete: () => void;
  /** Whether the countdown should be active */
  isActive: boolean;
};

/**
 * Custom hook to manage modal auto-dismiss countdown timer.
 * Cleans up timers properly on unmount or when isActive changes.
 *
 * @example
 * ```tsx
 * useModalCountdown({
 *   isActive: isOpen,
 *   duration: 4000,
 *   onComplete: handleClose,
 * });
 * ```
 */
export function useModalCountdown({
  duration,
  onComplete,
  isActive,
}: UseModalCountdownOptions): void {
  const onCompleteRef = useRef(onComplete);

  // Keep onComplete ref in sync to avoid stale closures
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const timer = setTimeout(() => {
      onCompleteRef.current();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [isActive, duration]);
}
