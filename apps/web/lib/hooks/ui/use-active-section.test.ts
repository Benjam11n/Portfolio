import { createMockIntersectionEntry } from "@repo/testing/test-types";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useActiveSection } from "./use-active-section";

describe("useActiveSection", () => {
  let intersectionCallback: IntersectionObserverCallback;
  let observeSpy: ReturnType<typeof vi.fn>;
  let disconnectSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    observeSpy = vi.fn();
    disconnectSpy = vi.fn();

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
      takeRecords() {
        return [];
      }
    } as unknown as typeof IntersectionObserver;

    // Mock document.getElementById
    vi.spyOn(document, "getElementById").mockImplementation((_id) => {
      return document.createElement("div");
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should initialize with first section", () => {
    const { result } = renderHook(() =>
      useActiveSection(["section1", "section2"])
    );
    // The hook initializes to the first section for navigation purposes
    expect(result.current).toBe("section1");
    // It should observe elements (may be called multiple times due to React 18 strict mode)
    expect(observeSpy).toHaveBeenCalled();
  });

  it("should update active section when one becomes visible", () => {
    const { result } = renderHook(() =>
      useActiveSection(["section1", "section2"])
    );

    // Simulate section1 becoming visible
    act(() => {
      const entries = [
        createMockIntersectionEntry({
          id: "section1",
          isIntersecting: true,
          intersectionRatio: 0.8,
        }),
        createMockIntersectionEntry({
          id: "section2",
          isIntersecting: true,
          intersectionRatio: 0.1,
        }),
      ];

      intersectionCallback(
        entries,
        window.IntersectionObserver as unknown as IntersectionObserver
      );
    });

    expect(result.current).toBe("section1");
  });

  it("should switch active section when another becomes MORE visible", async () => {
    const { result } = renderHook(() =>
      useActiveSection(["section1", "section2"])
    );

    // Step 1: section1 is dominant
    await act(() => {
      intersectionCallback(
        [
          createMockIntersectionEntry({
            id: "section1",
            isIntersecting: true,
            intersectionRatio: 0.8,
          }),
          createMockIntersectionEntry({
            id: "section2",
            isIntersecting: true,
            intersectionRatio: 0.1,
          }),
        ],
        window.IntersectionObserver as unknown as IntersectionObserver
      );
    });
    expect(result.current).toBe("section1");

    // Step 2: section2 becomes dominant
    await act(() => {
      intersectionCallback(
        [
          createMockIntersectionEntry({
            id: "section1",
            isIntersecting: true,
            intersectionRatio: 0.2,
          }),
          createMockIntersectionEntry({
            id: "section2",
            isIntersecting: true,
            intersectionRatio: 0.9,
          }),
        ],
        window.IntersectionObserver as unknown as IntersectionObserver
      );
    });

    // Wait for state update to propagate
    await waitFor(() => {
      expect(result.current).toBe("section2");
    });
  });

  it("should handle mixed updates (some existing, some new)", async () => {
    const { result } = renderHook(() =>
      useActiveSection(["section1", "section2"])
    );

    // Initial state: section1=0.5
    await act(() => {
      intersectionCallback(
        [
          createMockIntersectionEntry({
            id: "section1",
            isIntersecting: true,
            intersectionRatio: 0.5,
          }),
        ],
        window.IntersectionObserver as unknown as IntersectionObserver
      );
    });
    expect(result.current).toBe("section1");

    // Update: section2=0.8. Section1 stays at 0.5 (implicitly, as Map preserves it)
    // Wait, useActiveSection Map preserves state ONLY if we don't clear it.
    // The hook implementation creates `sectionRatios` inside `useEffect`.
    // So it persists across `handleIntersect` calls. Correct.

    await act(() => {
      intersectionCallback(
        [
          createMockIntersectionEntry({
            id: "section2",
            isIntersecting: true,
            intersectionRatio: 0.8,
          }),
        ],
        window.IntersectionObserver as unknown as IntersectionObserver
      );
    });

    // Now section1=0.5, section2=0.8 -> Result section2
    await waitFor(() => {
      expect(result.current).toBe("section2");
    });
  });
});
