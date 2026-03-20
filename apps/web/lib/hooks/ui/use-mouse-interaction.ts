"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import { Vector2, type WebGLRenderer } from "three";

type MouseInteractionOptions = {
  enabled: boolean;
  gl: WebGLRenderer;
  onPointerMove?: () => void;
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
  const { enabled, gl, onPointerMove } = options;

  const mousePos = useRef(new Vector2());
  const handlePointerMoveEvent = useEffectEvent(() => {
    onPointerMove?.();
  });

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handlePointerMove = (e: PointerEvent) => {
      const dpr = gl.getPixelRatio();
      mousePos.current.set(e.offsetX * dpr, e.offsetY * dpr);
      handlePointerMoveEvent();
    };

    gl.domElement.addEventListener("pointermove", handlePointerMove);
    return () => {
      gl.domElement.removeEventListener("pointermove", handlePointerMove);
    };
  }, [enabled, gl]);

  return {
    mousePos,
  };
}
