import { act, renderHook } from "@testing-library/react";

import { useAnimationFrame } from "./use-animation-frame";

describe(useAnimationFrame, () => {
  const requestAnimationFrameMock = vi.fn();
  const cancelAnimationFrameMock = vi.fn();
  let mediaQueryMatches = false;
  let nextFrameId = 1;
  let scheduledCallbacks = new Map<number, FrameRequestCallback>();

  beforeEach(() => {
    nextFrameId = 1;
    scheduledCallbacks = new Map();
    mediaQueryMatches = false;

    requestAnimationFrameMock.mockImplementation(
      (callback: FrameRequestCallback) => {
        const frameId = nextFrameId;
        nextFrameId += 1;
        scheduledCallbacks.set(frameId, callback);
        return frameId;
      }
    );
    cancelAnimationFrameMock.mockImplementation((frameId: number) => {
      scheduledCallbacks.delete(frameId);
    });

    vi.stubGlobal("requestAnimationFrame", requestAnimationFrameMock);
    vi.stubGlobal("cancelAnimationFrame", cancelAnimationFrameMock);
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query) =>
        ({
          addEventListener: vi.fn(),
          addListener: vi.fn(),
          dispatchEvent: vi.fn(),
          matches: mediaQueryMatches,
          media: query,
          onchange: null,
          removeEventListener: vi.fn(),
          removeListener: vi.fn(),
        }) satisfies MediaQueryList
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  const runFrame = (frameId: number, timestamp: number) => {
    const callback = scheduledCallbacks.get(frameId);
    if (!callback) {
      throw new Error(`No animation frame scheduled for ${frameId}`);
    }

    scheduledCallbacks.delete(frameId);

    act(() => {
      callback(timestamp);
    });
  };

  it("does not schedule animation frames when disabled", () => {
    renderHook(() =>
      useAnimationFrame(
        () => {
          // no-op
        },
        { enabled: false }
      )
    );

    expect(requestAnimationFrameMock).not.toHaveBeenCalled();
  });

  it("skips the animation loop when reduced motion is preferred", () => {
    mediaQueryMatches = true;

    renderHook(() =>
      useAnimationFrame(() => {
        // no-op
      })
    );

    expect(requestAnimationFrameMock).not.toHaveBeenCalled();
  });

  it("invokes the callback on each animation frame and reschedules the loop", () => {
    const callback = vi.fn();

    renderHook(() => useAnimationFrame(callback));

    expect(requestAnimationFrameMock.mock.calls).toHaveLength(1);
    runFrame(1, 16);

    expect(callback).toHaveBeenCalledWith(16);
    expect(requestAnimationFrameMock).toHaveBeenCalledTimes(2);
  });

  it("throttles callback execution when fps is provided", () => {
    const callback = vi.fn();

    renderHook(() => useAnimationFrame(callback, { fps: 30 }));

    runFrame(1, 0);
    expect(callback).not.toHaveBeenCalled();

    runFrame(2, 10);
    expect(callback).not.toHaveBeenCalled();

    runFrame(3, 40);
    expect(callback.mock.calls).toHaveLength(1);
    expect(callback).toHaveBeenNthCalledWith(1, 40);
  });

  it("cancels the scheduled frame when disabled after mount", () => {
    const { rerender, unmount } = renderHook(
      ({ enabled }) =>
        useAnimationFrame(
          () => {
            // no-op
          },
          { enabled }
        ),
      {
        initialProps: { enabled: true },
      }
    );

    rerender({ enabled: false });
    unmount();

    expect(cancelAnimationFrameMock).toHaveBeenCalledWith(1);
  });
});
