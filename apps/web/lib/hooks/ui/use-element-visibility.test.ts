import { act, renderHook } from "@testing-library/react";

import { useElementVisibility } from "./use-element-visibility";

describe(useElementVisibility, () => {
  let intersectionCallback: IntersectionObserverCallback;
  let observeSpy: ReturnType<typeof vi.fn>;
  let disconnectSpy: ReturnType<typeof vi.fn>;
  let eventListeners: Partial<Record<string, EventListener>> = {};

  beforeEach(() => {
    observeSpy = vi.fn();
    disconnectSpy = vi.fn();
    eventListeners = {};

    // Mock IntersectionObserver
    window.IntersectionObserver = class IntersectionObserver {
      readonly root: Element | Document | null = null;
      readonly rootMargin = "";
      readonly thresholds: number[] = [];

      constructor(
        callback: IntersectionObserverCallback,
        _options?: IntersectionObserverInit
      ) {
        intersectionCallback = callback;
      }

      observe = observeSpy;
      disconnect = disconnectSpy;
      takeRecords = vi.fn(() => []);
    } as unknown as typeof IntersectionObserver;

    // Mock document event listeners
    vi.spyOn(document, "addEventListener").mockImplementation(
      (event, callback) => {
        eventListeners[event] = callback as EventListener;
      }
    );

    vi.spyOn(document, "removeEventListener").mockImplementation((event) => {
      eventListeners[event] = undefined;
    });

    // Mock document.hidden
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => false,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should initialize with false (not visible)", () => {
    const ref = { current: document.createElement("div") };
    const { result } = renderHook(() => useElementVisibility(ref));

    expect(result.current).toBeFalsy();
    expect(observeSpy).toHaveBeenCalledWith(ref.current);
  });

  it("should return true when element intersects and page is visible", () => {
    const ref = { current: document.createElement("div") };
    const { result } = renderHook(() => useElementVisibility(ref));

    // Simulate element becoming visible
    act(() => {
      intersectionCallback(
        [
          {
            isIntersecting: true,
            target: ref.current,
          } as unknown as IntersectionObserverEntry,
        ],
        window.IntersectionObserver as unknown as IntersectionObserver
      );
    });

    expect(result.current).toBeTruthy();
  });

  it("should return false when element stops intersecting", () => {
    const ref = { current: document.createElement("div") };
    const { result } = renderHook(() => useElementVisibility(ref));

    // First make it visible
    act(() => {
      intersectionCallback(
        [{ isIntersecting: true } as unknown as IntersectionObserverEntry],
        window.IntersectionObserver as unknown as IntersectionObserver
      );
    });
    expect(result.current).toBeTruthy();

    // Then make it invisible
    act(() => {
      intersectionCallback(
        [{ isIntersecting: false } as unknown as IntersectionObserverEntry],
        window.IntersectionObserver as unknown as IntersectionObserver
      );
    });
    expect(result.current).toBeFalsy();
  });

  it("should return false when page becomes hidden", () => {
    const ref = { current: document.createElement("div") };
    const { result } = renderHook(() => useElementVisibility(ref));

    // Make element intersecting
    act(() => {
      intersectionCallback(
        [{ isIntersecting: true } as unknown as IntersectionObserverEntry],
        window.IntersectionObserver as unknown as IntersectionObserver
      );
    });
    expect(result.current).toBeTruthy();

    // Mock doc hidden = true
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => true,
    });

    // Fire visibilitychange event
    act(() => {
      eventListeners.visibilitychange?.(new Event("visibilitychange"));
    });

    expect(result.current).toBeFalsy();
  });

  it("should return true when page becomes visible again (if intersecting)", () => {
    const ref = { current: document.createElement("div") };
    const { result } = renderHook(() => useElementVisibility(ref));

    // Make element intersecting
    act(() => {
      intersectionCallback(
        [{ isIntersecting: true } as unknown as IntersectionObserverEntry],
        window.IntersectionObserver as unknown as IntersectionObserver
      );
    });

    // Hide page
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => true,
    });
    act(() => {
      eventListeners.visibilitychange?.(new Event("visibilitychange"));
    });
    expect(result.current).toBeFalsy();

    // Show page
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => false,
    });
    act(() => {
      eventListeners.visibilitychange?.(new Event("visibilitychange"));
    });

    expect(result.current).toBeTruthy();
  });

  it("should cleanup observer and listeners on unmount", () => {
    const ref = { current: document.createElement("div") };
    const { unmount } = renderHook(() => useElementVisibility(ref));

    unmount();

    expect(disconnectSpy).toHaveBeenCalledWith();
    // Check if visibilitychange listener is removed (mock logic deletes it from map)
    // But better to check spy directly if I spied on removeEventListener
    expect(document.removeEventListener).toHaveBeenCalledWith(
      "visibilitychange",
      expect.any(Function)
    );
  });

  it("should not observe if ref is null", () => {
    const ref = { current: null };
    renderHook(() => useElementVisibility(ref));

    expect(observeSpy).not.toHaveBeenCalled();
  });
});
