"use client";

import { useCallback, useEffect, useRef } from "react";
import { useFuzzyEventHandlers } from "../utils/use-fuzzy-event-handlers";

type FuzzyAnimationStateOptions = {
  baseIntensity: number;
  hoverIntensity: number;
  transitionDuration: number;
  frameDuration: number;
  enableHover: boolean;
  clickEffect: boolean;
  glitchMode: boolean;
  glitchInterval: number;
  glitchDuration: number;
  isCancelled: { current: boolean };
};

export type FuzzyAnimationStateReturn = {
  isHovering: { current: boolean };
  isClicking: { current: boolean };
  isGlitching: { current: boolean };
  currentIntensity: { current: number };
  updateIntensity: () => void;
  setupEventListeners: (
    canvas: HTMLCanvasElement,
    isInsideTextArea: (x: number, y: number) => boolean
  ) => void;
  removeEventListeners: (canvas: HTMLCanvasElement) => void;
  cleanup: () => void;
};

/**
 * Custom hook to manage animation state for fuzzy text effect.
 *
 * This hook handles:
 * - Hover, click, and glitch state management
 * - Intensity transitions with smooth animations
 * - Event listener setup for mouse and touch interactions
 * - Automatic cleanup of timeouts and event listeners
 *
 * @param options - Configuration options for the animation state
 * @returns Object containing state refs and control functions
 *
 * @example
 * ```tsx
 * const animationState = useFuzzyAnimationState({
 *   baseIntensity: 0.18,
 *   hoverIntensity: 0.5,
 *   transitionDuration: 0,
 *   frameDuration: 1000 / 60,
 *   enableHover: true,
 *   clickEffect: false,
 *   glitchMode: false,
 *   glitchInterval: 2000,
 *   glitchDuration: 200,
 *   isCancelled: { current: false },
 * });
 *
 * // Use in animation loop
 * animationState.updateIntensity();
 * const intensity = animationState.currentIntensity.current;
 * ```
 */
export function useFuzzyAnimationState(
  options: FuzzyAnimationStateOptions
): FuzzyAnimationStateReturn {
  const {
    baseIntensity,
    hoverIntensity,
    transitionDuration,
    frameDuration,
    enableHover,
    clickEffect,
    glitchMode,
    glitchInterval,
    glitchDuration,
    isCancelled,
  } = options;

  const isHovering = useRef(false);
  const isClicking = useRef(false);
  const isGlitching = useRef(false);
  const currentIntensity = useRef(baseIntensity);

  // Store timeout IDs for cleanup
  const glitchTimeoutIdRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const glitchEndTimeoutIdRef =
    useRef<ReturnType<typeof setTimeout>>(undefined);

  // Use event handlers hook
  const eventHandlers = useFuzzyEventHandlers({
    enableHover,
    clickEffect,
    isCancelled,
    onHoverChange: (hovering) => {
      isHovering.current = hovering;
    },
    onClickStart: () => {
      isClicking.current = true;
    },
    onClickEnd: () => {
      isClicking.current = false;
    },
  });

  const startGlitchLoop = useCallback(() => {
    if (!glitchMode || isCancelled.current) {
      return;
    }
    glitchTimeoutIdRef.current = setTimeout(() => {
      if (isCancelled.current) {
        return;
      }
      isGlitching.current = true;
      glitchEndTimeoutIdRef.current = setTimeout(() => {
        isGlitching.current = false;
        startGlitchLoop();
      }, glitchDuration);
    }, glitchInterval);
  }, [glitchMode, glitchInterval, glitchDuration, isCancelled]);

  // Start glitch loop when glitch mode is enabled
  useEffect(() => {
    if (glitchMode) {
      startGlitchLoop();
    }
    // Cleanup when glitchMode changes or component unmounts
    return () => {
      if (glitchTimeoutIdRef.current) {
        clearTimeout(glitchTimeoutIdRef.current);
      }
      if (glitchEndTimeoutIdRef.current) {
        clearTimeout(glitchEndTimeoutIdRef.current);
      }
    };
  }, [glitchMode, startGlitchLoop]);

  const updateIntensity = () => {
    let newTargetIntensity = baseIntensity;
    if (isClicking.current || isGlitching.current) {
      newTargetIntensity = 1;
    } else if (isHovering.current) {
      newTargetIntensity = hoverIntensity;
    }

    if (transitionDuration > 0) {
      const step = 1 / (transitionDuration / frameDuration);
      if (currentIntensity.current < newTargetIntensity) {
        currentIntensity.current = Math.min(
          currentIntensity.current + step,
          newTargetIntensity
        );
      } else if (currentIntensity.current > newTargetIntensity) {
        currentIntensity.current = Math.max(
          currentIntensity.current - step,
          newTargetIntensity
        );
      }
    } else {
      currentIntensity.current = newTargetIntensity;
    }
  };

  const cleanup = () => {
    // Clear any remaining glitch timeouts
    if (glitchTimeoutIdRef.current) {
      clearTimeout(glitchTimeoutIdRef.current);
      glitchTimeoutIdRef.current = undefined;
    }
    if (glitchEndTimeoutIdRef.current) {
      clearTimeout(glitchEndTimeoutIdRef.current);
      glitchEndTimeoutIdRef.current = undefined;
    }
    eventHandlers.cleanup();
  };

  return {
    isHovering,
    isClicking,
    isGlitching,
    currentIntensity,
    updateIntensity,
    setupEventListeners: eventHandlers.setupEventListeners,
    removeEventListeners: eventHandlers.removeEventListeners,
    cleanup,
  };
}
