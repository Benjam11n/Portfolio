"use client";

import { useRef } from "react";

type FuzzyEventHandlersOptions = {
  enableHover: boolean;
  clickEffect: boolean;
  isCancelled: { current: boolean };
  onHoverChange: (isHovering: boolean) => void;
  onClickStart: () => void;
  onClickEnd: () => void;
};

type FuzzyEventHandlersReturn = {
  setupEventListeners: (
    canvas: HTMLCanvasElement,
    isInsideTextArea: (x: number, y: number) => boolean
  ) => void;
  removeEventListeners: (canvas: HTMLCanvasElement) => void;
  cleanup: () => void;
};

/**
 * Custom hook to manage event listeners for fuzzy text effect.
 *
 * This hook handles:
 * - Mouse and touch event listeners for hover interactions
 * - Click event listener for click effect
 * - Proper cleanup of event listeners and timeouts
 *
 * @param options - Configuration options for event handlers
 * @returns Object containing setup, removal, and cleanup functions
 *
 * @example
 * ```tsx
 * const eventHandlers = useFuzzyEventHandlers({
 *   enableHover: true,
 *   clickEffect: false,
 *   isCancelled: { current: false },
 *   onHoverChange: (hovering) => console.log(hovering),
 *   onClickStart: () => console.log('click started'),
 *   onClickEnd: () => console.log('click ended'),
 * });
 *
 * // Set up listeners
 * eventHandlers.setupEventListeners(canvas, isInsideTextArea);
 *
 * // Clean up
 * eventHandlers.removeEventListeners(canvas);
 * eventHandlers.cleanup();
 * ```
 */
export function useFuzzyEventHandlers(
  options: FuzzyEventHandlersOptions
): FuzzyEventHandlersReturn {
  const {
    enableHover,
    clickEffect,
    // isCancelled,
    onHoverChange,
    onClickStart,
    onClickEnd,
  } = options;

  // Store event handlers for cleanup
  const handleMouseMoveRef = useRef<((e: MouseEvent) => void) | null>(null);
  const handleMouseLeaveRef = useRef<(() => void) | null>(null);
  const handleClickRef = useRef<(() => void) | null>(null);
  const handleTouchMoveRef = useRef<((e: TouchEvent) => void) | null>(null);
  const handleTouchEndRef = useRef<(() => void) | null>(null);

  // Store timeout ID for click effect cleanup
  const clickTimeoutIdRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const setupEventListeners = (
    canvas: HTMLCanvasElement,
    isInsideTextArea: (x: number, y: number) => boolean
  ) => {
    handleMouseMoveRef.current = (e: MouseEvent) => {
      if (!enableHover) {
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      onHoverChange(isInsideTextArea(x, y));
    };

    handleMouseLeaveRef.current = () => {
      onHoverChange(false);
    };

    handleClickRef.current = () => {
      if (!clickEffect) {
        return;
      }
      onClickStart();
      if (clickTimeoutIdRef.current) {
        clearTimeout(clickTimeoutIdRef.current);
      }
      clickTimeoutIdRef.current = setTimeout(() => {
        onClickEnd();
      }, 150);
    };

    handleTouchMoveRef.current = (e: TouchEvent) => {
      if (!enableHover) {
        return;
      }
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      onHoverChange(isInsideTextArea(x, y));
    };

    handleTouchEndRef.current = () => {
      onHoverChange(false);
    };

    if (enableHover) {
      canvas.addEventListener("mousemove", handleMouseMoveRef.current);
      canvas.addEventListener("mouseleave", handleMouseLeaveRef.current);
      canvas.addEventListener("touchmove", handleTouchMoveRef.current, {
        passive: false,
      });
      canvas.addEventListener("touchend", handleTouchEndRef.current);
    }

    if (clickEffect) {
      canvas.addEventListener("click", handleClickRef.current);
    }
  };

  const removeEventListeners = (canvas: HTMLCanvasElement) => {
    if (
      enableHover &&
      handleMouseMoveRef.current &&
      handleMouseLeaveRef.current &&
      handleTouchMoveRef.current &&
      handleTouchEndRef.current
    ) {
      canvas.removeEventListener("mousemove", handleMouseMoveRef.current);
      canvas.removeEventListener("mouseleave", handleMouseLeaveRef.current);
      canvas.removeEventListener("touchmove", handleTouchMoveRef.current);
      canvas.removeEventListener("touchend", handleTouchEndRef.current);
    }
    if (clickEffect && handleClickRef.current) {
      canvas.removeEventListener("click", handleClickRef.current);
    }
  };

  const cleanup = () => {
    if (clickTimeoutIdRef.current) {
      clearTimeout(clickTimeoutIdRef.current);
    }
  };

  return {
    setupEventListeners,
    removeEventListeners,
    cleanup,
  };
}
