import { act, renderHook } from "@testing-library/react";
import type { RefObject } from "react";

import { useCanvasResize } from "./use-canvas-resize";

describe(useCanvasResize, () => {
  let observedElement: Element | undefined;
  let resizeCallback: ResizeObserverCallback | undefined;

  class ResizeObserverMock {
    disconnect = vi.fn();
    observe = vi.fn((element: Element) => {
      observedElement = element;
    });

    constructor(callback: ResizeObserverCallback) {
      resizeCallback = callback;
    }
  }

  beforeEach(() => {
    vi.useFakeTimers();
    observedElement = undefined;
    resizeCallback = undefined;
    vi.stubGlobal("ResizeObserver", ResizeObserverMock);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  const createCanvasRef = (width = 320, height = 180) => {
    const parent = document.createElement("div");
    const canvas = document.createElement("canvas");

    vi.spyOn(parent, "getBoundingClientRect").mockImplementation(
      () =>
        ({
          bottom: height,
          height,
          left: 0,
          right: width,
          top: 0,
          width,
          x: 0,
          y: 0,
        }) as DOMRect
    );
    parent.append(canvas);

    return {
      canvas,
      parent,
      ref: { current: canvas } satisfies RefObject<HTMLCanvasElement | null>,
    };
  };

  it("sizes the canvas to its parent on mount", () => {
    const { canvas, ref } = createCanvasRef();

    renderHook(() => useCanvasResize(ref));

    expect(canvas.width).toBe(320);
    expect(canvas.height).toBe(180);
    expect(observedElement).toBe(canvas.parentElement);
  });

  it("debounces resize observer updates", () => {
    const { canvas, parent, ref } = createCanvasRef(400, 240);

    renderHook(() => useCanvasResize(ref, 50));

    vi.spyOn(parent, "getBoundingClientRect").mockImplementation(
      () =>
        ({
          bottom: 320,
          height: 320,
          left: 0,
          right: 640,
          top: 0,
          width: 640,
          x: 0,
          y: 0,
        }) as DOMRect
    );

    act(() => {
      resizeCallback?.([], {} as ResizeObserver);
      vi.advanceTimersByTime(49);
    });

    expect(canvas.width).toBe(400);
    expect(canvas.height).toBe(240);

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(canvas.width).toBe(640);
    expect(canvas.height).toBe(320);
  });
});
