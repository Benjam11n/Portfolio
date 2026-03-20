import { act, renderHook } from "@testing-library/react";
import type { WebGLRenderer } from "three";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useMouseInteraction } from "./use-mouse-interaction";

describe("useMouseInteraction", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("attaches pointermove to the canvas element, not window", () => {
    const canvas = document.createElement("canvas");
    const addEventListenerSpy = vi.spyOn(canvas, "addEventListener");
    const windowAddEventListenerSpy = vi.spyOn(window, "addEventListener");
    const gl = {
      domElement: canvas,
      getPixelRatio: () => 1,
    } as unknown as WebGLRenderer;

    renderHook(() => useMouseInteraction({ enabled: true, gl }));

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "pointermove",
      expect.any(Function)
    );
    expect(windowAddEventListenerSpy).not.toHaveBeenCalled();
  });

  it("updates mouse position from event-local coordinates", () => {
    const canvas = document.createElement("canvas");
    const gl = {
      domElement: canvas,
      getPixelRatio: () => 2,
    } as unknown as WebGLRenderer;
    let pointerMoveHandler: ((event: PointerEvent) => void) | undefined;

    vi.spyOn(canvas, "addEventListener").mockImplementation(
      (type, listener) => {
        if (type === "pointermove") {
          pointerMoveHandler = listener as (event: PointerEvent) => void;
        }
      }
    );

    const { result } = renderHook(() =>
      useMouseInteraction({ enabled: true, gl })
    );

    act(() => {
      pointerMoveHandler?.({
        offsetX: 12,
        offsetY: 18,
      } as PointerEvent);
    });

    expect(result.current.mousePos.current.x).toBe(24);
    expect(result.current.mousePos.current.y).toBe(36);
  });

  it("does not attach listeners when disabled", () => {
    const canvas = document.createElement("canvas");
    const addEventListenerSpy = vi.spyOn(canvas, "addEventListener");
    const gl = {
      domElement: canvas,
      getPixelRatio: () => 1,
    } as unknown as WebGLRenderer;

    renderHook(() => useMouseInteraction({ enabled: false, gl }));

    expect(addEventListenerSpy).not.toHaveBeenCalled();
  });
});
