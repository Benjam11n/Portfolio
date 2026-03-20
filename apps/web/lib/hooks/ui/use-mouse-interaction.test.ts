import { act, renderHook } from "@testing-library/react";
import type { WebGLRenderer } from "three";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useMouseInteraction } from "./use-mouse-interaction";

describe("useMouseInteraction", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("attaches mousemove to window", () => {
    const canvas = document.createElement("canvas");
    vi.spyOn(canvas, "getBoundingClientRect").mockReturnValue({
      bottom: 120,
      height: 100,
      left: 10,
      right: 210,
      toJSON: () => ({}),
      top: 20,
      width: 200,
      x: 10,
      y: 20,
    });
    const windowAddEventListenerSpy = vi.spyOn(window, "addEventListener");
    const gl = {
      domElement: canvas,
      getPixelRatio: () => 1,
    } as unknown as WebGLRenderer;

    renderHook(() => useMouseInteraction({ enabled: true, gl }));

    expect(windowAddEventListenerSpy).toHaveBeenCalledWith(
      "mousemove",
      expect.any(Function)
    );
  });

  it("updates mouse position from window coordinates", () => {
    const canvas = document.createElement("canvas");
    vi.spyOn(canvas, "getBoundingClientRect").mockReturnValue({
      bottom: 220,
      height: 200,
      left: 10,
      right: 210,
      toJSON: () => ({}),
      top: 20,
      width: 200,
      x: 10,
      y: 20,
    });
    const gl = {
      domElement: canvas,
      getPixelRatio: () => 2,
    } as unknown as WebGLRenderer;
    let mouseMoveHandler: ((event: MouseEvent) => void) | undefined;

    vi.spyOn(window, "addEventListener").mockImplementation(
      (type, listener) => {
        if (type === "mousemove") {
          mouseMoveHandler = listener as (event: MouseEvent) => void;
        }
      }
    );

    const { result } = renderHook(() =>
      useMouseInteraction({ enabled: true, gl })
    );

    act(() => {
      mouseMoveHandler?.({
        clientX: 22,
        clientY: 38,
      } as MouseEvent);
    });

    expect(result.current.mousePos.current.x).toBe(24);
    expect(result.current.mousePos.current.y).toBe(36);
  });

  it("does not attach window listeners when disabled", () => {
    const canvas = document.createElement("canvas");
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    const gl = {
      domElement: canvas,
      getPixelRatio: () => 1,
    } as unknown as WebGLRenderer;

    renderHook(() => useMouseInteraction({ enabled: false, gl }));

    expect(addEventListenerSpy).not.toHaveBeenCalled();
  });
});
