import { act, renderHook } from "@testing-library/react";
import type { WebGLRenderer } from "three";

import { useMouseInteraction } from "./use-mouse-interaction";

describe(useMouseInteraction, () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const createRenderer = (pixelRatio = 1) => {
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

    return {
      domElement: canvas,
      getPixelRatio: () => pixelRatio,
    } as unknown as WebGLRenderer;
  };

  it("updates the tracked mouse position relative to the canvas and device pixel ratio", () => {
    let mouseMoveHandler: ((event: MouseEvent) => void) | undefined;

    vi.spyOn(window, "addEventListener").mockImplementation(
      (type, listener) => {
        if (type === "mousemove") {
          mouseMoveHandler = listener as (event: MouseEvent) => void;
        }
      }
    );

    const { result } = renderHook(() =>
      useMouseInteraction({ enabled: true, gl: createRenderer(2) })
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

  it("removes the window mousemove listener on unmount", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() =>
      useMouseInteraction({ enabled: true, gl: createRenderer() })
    );

    const listener = addEventListenerSpy.mock.calls.find(
      ([eventName]) => eventName === "mousemove"
    )?.[1];

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith("mousemove", listener);
  });

  it("does not subscribe to mousemove events when disabled", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");

    renderHook(() =>
      useMouseInteraction({ enabled: false, gl: createRenderer() })
    );

    expect(addEventListenerSpy).not.toHaveBeenCalled();
  });
});
