"use client";

import { useEffect, useRef } from "react";
import { Vector2 } from "three";
import type { WebGLRenderer } from "three";

interface MouseInteractionOptions {
  enabled: boolean;
  gl: WebGLRenderer;
}

interface MouseInteractionReturn {
  mousePos: React.RefObject<Vector2>;
}

/**
 * Custom hook to track mouse position relative to a canvas element.
 *
 * This hook handles:
 * - Mouse move event listener setup and cleanup
 * - Converting client coordinates to canvas-relative coordinates
 * - Applying device pixel ratio for pixel-perfect positioning
 *
 * @param options - Configuration options for mouse interaction
 * @returns Object containing mouse position ref
 *
 * @example
 * ```tsx
 * const { mousePos } = useMouseInteraction({
 *   enabled: true,
 *   gl,
 * });
 *
 * // Use in shader uniforms
 * uniforms.mousePos.value.copy(mousePos.current);
 * ```
 */
export const useMouseInteraction = (
  options: MouseInteractionOptions
): MouseInteractionReturn => {
  const { enabled, gl } = options;

  const mousePos = useRef<Vector2 | null>(null);
  if (mousePos.current === null) {
    mousePos.current = new Vector2();
  }
  const currentMousePos = mousePos.current;

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const dpr = gl.getPixelRatio();
      currentMousePos.set(
        (e.clientX - rect.left) * dpr,
        (e.clientY - rect.top) * dpr
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [currentMousePos, enabled, gl]);

  return {
    mousePos: mousePos as React.RefObject<Vector2>,
  };
};
