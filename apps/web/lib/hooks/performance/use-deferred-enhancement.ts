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

const scheduleDeferredActivation = (activate: () => void, delayMs: number) => {
  const timeoutId = window.setTimeout(activate, delayMs);
  const idleId =
    "requestIdleCallback" in window
      ? window.requestIdleCallback(activate, { timeout: delayMs })
      : null;

  return () => {
    window.clearTimeout(timeoutId);

    if (idleId !== null && "cancelIdleCallback" in window) {
      window.cancelIdleCallback(idleId);
    }
  };
};

const subscribeToActivationInteraction = (activate: () => void) => {
  for (const eventName of INTERACTION_EVENTS) {
    window.addEventListener(eventName, activate, {
      once: true,
      passive: true,
    });
  }

  return () => {
    for (const eventName of INTERACTION_EVENTS) {
      window.removeEventListener(eventName, activate);
    }
  };
};

export const useDeferredEnhancement = ({
  delayMs = 1200,
  activateOnInteraction = true,
}: UseDeferredEnhancementOptions = {}) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isActive) {
      return;
    }

    const activate = () => {
      setIsActive(true);
    };

    const cancelDeferredActivation = scheduleDeferredActivation(
      activate,
      delayMs
    );
    const unsubscribeFromInteraction = activateOnInteraction
      ? subscribeToActivationInteraction(activate)
      : undefined;

    return () => {
      cancelDeferredActivation();
      unsubscribeFromInteraction?.();
    };
  }, [activateOnInteraction, delayMs, isActive]);

  return isActive;
};
