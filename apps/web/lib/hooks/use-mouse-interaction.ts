"use client";

import { useEffect, useRef } from "react";
import { Vector2, type WebGLRenderer } from "three";

type MouseInteractionOptions = {
  enabled: boolean;
  gl: WebGLRenderer;
};

type MouseInteractionReturn = {
  mousePos: React.MutableRefObject<Vector2>;
};

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
export function useMouseInteraction(
  options: MouseInteractionOptions
): MouseInteractionReturn {
  const { enabled, gl } = options;

  const mousePos = useRef(new Vector2());

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const dpr = gl.getPixelRatio();
      mousePos.current.set(
        (e.clientX - rect.left) * dpr,
        (e.clientY - rect.top) * dpr
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [enabled, gl]);

  return {
    mousePos,
  };
}
