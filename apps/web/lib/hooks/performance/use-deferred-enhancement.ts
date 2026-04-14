"use client";

import { useEffect, useState } from "react";

interface UseDeferredEnhancementOptions {
  delayMs?: number;
  activateOnInteraction?: boolean;
}

const INTERACTION_EVENTS: (keyof WindowEventMap)[] = [
  "keydown",
  "pointerdown",
  "pointermove",
  "touchstart",
  "wheel",
];

export const useDeferredEnhancement = ({
  delayMs = 1200,
  activateOnInteraction = true,
}: UseDeferredEnhancementOptions = {}) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isActive) {
      return;
    }

    let timeoutId: number | null = null;
    let idleId: number | null = null;

    const activate = () => {
      setIsActive(true);
    };

    timeoutId = window.setTimeout(activate, delayMs);

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(activate, { timeout: delayMs });
    }

    if (activateOnInteraction) {
      for (const eventName of INTERACTION_EVENTS) {
        window.addEventListener(eventName, activate, {
          once: true,
          passive: true,
        });
      }
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      if (idleId && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }

      if (activateOnInteraction) {
        for (const eventName of INTERACTION_EVENTS) {
          window.removeEventListener(eventName, activate);
        }
      }
    };
  }, [activateOnInteraction, delayMs, isActive]);

  return isActive;
};
