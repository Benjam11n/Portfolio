import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useActiveSection } from "./use-active-section";

describe("useActiveSection", () => {
  let intersectionCallback: IntersectionObserverCallback;
  let observeSpy: any;
  let disconnectSpy: any;

  beforeEach(() => {
    observeSpy = vi.fn();
    disconnectSpy = vi.fn();

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

    // Mock document.getElementById
    vi.spyOn(document, "getElementById").mockImplementation((_id) => {
      return document.createElement("div");
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should initialize with null", () => {
    const { result } = renderHook(() =>
      useActiveSection(["section1", "section2"])
    );
    expect(result.current).toBeNull();
    // It should observe elements
    expect(observeSpy).toHaveBeenCalledTimes(2);
  });

  it("should update active section when one becomes visible", () => {
    const { result } = renderHook(() =>
      useActiveSection(["section1", "section2"])
    );

    // Simulate section1 becoming visible
    act(() => {
      intersectionCallback(
        [
          {
            target: { id: "section1" },
            isIntersecting: true,
            intersectionRatio: 0.8,
          } as any,
          {
            target: { id: "section2" },
            isIntersecting: true,
            intersectionRatio: 0.1,
          } as any,
        ],
        window.IntersectionObserver as any
      );
    });

    expect(result.current).toBe("section1");
  });

  it("should switch active section when another becomes MORE visible", () => {
    const { result } = renderHook(() =>
      useActiveSection(["section1", "section2"])
    );

    // Step 1: section1 is dominant
    act(() => {
      intersectionCallback(
        [
          {
            target: { id: "section1" },
            isIntersecting: true,
            intersectionRatio: 0.8,
          } as any,
          {
            target: { id: "section2" },
            isIntersecting: true,
            intersectionRatio: 0.1,
          } as any,
        ],
        window.IntersectionObserver as any
      );
    });
    expect(result.current).toBe("section1");

    // Step 2: section2 becomes dominant
    act(() => {
      intersectionCallback(
        [
          {
            target: { id: "section1" },
            isIntersecting: true,
            intersectionRatio: 0.2,
          } as any,
          {
            target: { id: "section2" },
            isIntersecting: true,
            intersectionRatio: 0.9,
          } as any,
        ],
        window.IntersectionObserver as any
      );
    });
    expect(result.current).toBe("section2");
  });

  it("should handle mixed updates (some existing, some new)", () => {
    const { result } = renderHook(() =>
      useActiveSection(["section1", "section2"])
    );

    // Initial state: section1=0.5
    act(() => {
      intersectionCallback(
        [
          {
            target: { id: "section1" },
            isIntersecting: true,
            intersectionRatio: 0.5,
          } as any,
        ],
        window.IntersectionObserver as any
      );
    });
    expect(result.current).toBe("section1");

    // Update: section2=0.8. Section1 stays at 0.5 (implicitly, as Map preserves it)
    // Wait, useActiveSection Map preserves state ONLY if we don't clear it.
    // The hook implementation creates `sectionRatios` inside `useEffect`.
    // So it persists across `handleIntersect` calls. Correct.

    act(() => {
      intersectionCallback(
        [
          {
            target: { id: "section2" },
            isIntersecting: true,
            intersectionRatio: 0.8,
          } as any,
        ],
        window.IntersectionObserver as any
      );
    });
    // Now section1=0.5, section2=0.8 -> Result section2
    expect(result.current).toBe("section2");
  });
});
