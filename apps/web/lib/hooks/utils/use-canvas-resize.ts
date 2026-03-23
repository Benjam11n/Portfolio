"use client";

import { useCallback, useEffect } from "react";
import type { RefObject } from "react";

/**
 * Custom hook to handle canvas resizing with ResizeObserver and debouncing.
 * Automatically resizes canvas to match parent element dimensions.
 *
 * Use this hook for canvas-based components that need to respond to
 * parent container size changes:
 * - Automatically observes parent element resize
 * - Debounces resize events for performance
 * - Returns manual trigger function for explicit updates
 * - Cleans up observers on unmount
 *
 * @param canvasRef - Reference to the canvas element to resize
 * @param debounceMs - Debounce delay in milliseconds (default: 100)
 * @returns A function to manually trigger canvas resize
 *
 * @example
 * ```tsx
 * const canvasRef = useRef<HTMLCanvasElement>(null);
 * const resizeCanvas = useCanvasResize(canvasRef, 100);
 *
 * // Canvas automatically resizes when parent changes
 * // Can also manually trigger: resizeCanvas()
 * ```
 */
export const useCanvasResize = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  debounceMs = 100
): (() => void) => {
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const parent = canvas.parentElement;
    if (!parent) {
      return;
    }

    const { width, height } = parent.getBoundingClientRect();
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  }, [canvasRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const parent = canvas.parentElement;
    if (!parent) {
      return;
    }

    let resizeTimeout: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, debounceMs);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(parent);

    // Initial resize
    resizeCanvas();

    return () => {
      resizeObserver.disconnect();
      clearTimeout(resizeTimeout);
    };
  }, [canvasRef, resizeCanvas, debounceMs]);

  return resizeCanvas;
};
