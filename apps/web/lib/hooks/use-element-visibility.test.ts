import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useElementVisibility } from "./use-element-visibility";

describe("useElementVisibility", () => {
  let intersectionCallback: IntersectionObserverCallback;
  let observeSpy: any;
  let disconnectSpy: any;
  let eventListeners: Record<string, EventListener> = {};

  beforeEach(() => {
    observeSpy = vi.fn();
    disconnectSpy = vi.fn();
    eventListeners = {};

    // Mock IntersectionObserver
    window.IntersectionObserver = class IntersectionObserver {
      constructor(
        callback: IntersectionObserverCallback,
        _options?: IntersectionObserverInit
      ) {
        intersectionCallback = callback;
      }
      root = null;
      rootMargin = "";
      thresholds = [];
      observe = observeSpy;
      disconnect = disconnectSpy;
      takeRecords = vi.fn();
    } as any;

    // Mock document event listeners
    vi.spyOn(document, "addEventListener").mockImplementation(
      (event, callback) => {
        eventListeners[event] = callback as EventListener;
      }
    );

    vi.spyOn(document, "removeEventListener").mockImplementation((event) => {
      delete eventListeners[event];
    });

    // Mock document.hidden
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => false, // Default to visible
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should initialize with false (not visible)", () => {
    const ref = { current: document.createElement("div") };
    const { result } = renderHook(() => useElementVisibility(ref));

    expect(result.current).toBe(false);
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
        window.IntersectionObserver as any
      );
    });

    expect(result.current).toBe(true);
  });

  it("should return false when element stops intersecting", () => {
    const ref = { current: document.createElement("div") };
    const { result } = renderHook(() => useElementVisibility(ref));

    // First make it visible
    act(() => {
      intersectionCallback(
        [{ isIntersecting: true } as unknown as IntersectionObserverEntry],
        window.IntersectionObserver as any
      );
    });
    expect(result.current).toBe(true);

    // Then make it invisible
    act(() => {
      intersectionCallback(
        [{ isIntersecting: false } as unknown as IntersectionObserverEntry],
        window.IntersectionObserver as any
      );
    });
    expect(result.current).toBe(false);
  });

  it("should return false when page becomes hidden", () => {
    const ref = { current: document.createElement("div") };
    const { result } = renderHook(() => useElementVisibility(ref));

    // Make element intersecting
    act(() => {
      intersectionCallback(
        [{ isIntersecting: true } as unknown as IntersectionObserverEntry],
        window.IntersectionObserver as any
      );
    });
    expect(result.current).toBe(true);

    // Mock doc hidden = true
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => true,
    });

    // Fire visibilitychange event
    act(() => {
      eventListeners.visibilitychange(new Event("visibilitychange"));
    });

    expect(result.current).toBe(false);
  });

  it("should return true when page becomes visible again (if intersecting)", () => {
    const ref = { current: document.createElement("div") };
    const { result } = renderHook(() => useElementVisibility(ref));

    // Make element intersecting
    act(() => {
      intersectionCallback(
        [{ isIntersecting: true } as unknown as IntersectionObserverEntry],
        window.IntersectionObserver as any
      );
    });

    // Hide page
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => true,
    });
    act(() => {
      eventListeners.visibilitychange(new Event("visibilitychange"));
    });
    expect(result.current).toBe(false);

    // Show page
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => false,
    });
    act(() => {
      eventListeners.visibilitychange(new Event("visibilitychange"));
    });

    expect(result.current).toBe(true);
  });

  it("should cleanup observer and listeners on unmount", () => {
    const ref = { current: document.createElement("div") };
    const { unmount } = renderHook(() => useElementVisibility(ref));

    unmount();

    expect(disconnectSpy).toHaveBeenCalled();
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
