import type { EventListenerMap } from "@repo/testing/test-types";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

describe("usePrefersReducedMotion", () => {
  let matchMediaMock: ReturnType<typeof vi.fn>;
  let listeners: EventListenerMap;

  beforeEach(() => {
    listeners = {};

    matchMediaMock = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // Deprecated
      removeListener: vi.fn(), // Deprecated
      addEventListener: vi.fn((event: string, callback: EventListener) => {
        if (!listeners[event]) {
          listeners[event] = [];
        }
        listeners[event].push(callback as (event: Event) => void);
      }),
      removeEventListener: vi.fn((event: string, callback: EventListener) => {
        if (listeners[event]) {
          listeners[event] = listeners[event].filter((cb) => cb !== callback);
        }
      }),
      dispatchEvent: vi.fn(),
    }));

    window.matchMedia = matchMediaMock as unknown as typeof window.matchMedia;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return false by default (when no preference)", () => {
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
  });

  it("should return true when media query matches", () => {
    matchMediaMock.mockImplementation((query: string) => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);
  });

  it("should update when preference changes", () => {
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);

    // Simulate change event
    act(() => {
      const changeHandler = listeners.change?.[0];
      if (changeHandler) {
        changeHandler({ matches: true } as MediaQueryListEvent);
      }
    });

    expect(result.current).toBe(true);

    // Change back
    act(() => {
      const changeHandler = listeners.change?.[0];
      if (changeHandler) {
        changeHandler({ matches: false } as MediaQueryListEvent);
      }
    });

    expect(result.current).toBe(false);
  });

  it("should cleanup event listener on unmount", () => {
    // We need to spy on the instance that will be returned by matchMedia
    const removeListenerSpy = vi.fn();
    matchMediaMock.mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: removeListenerSpy,
    }));

    const { unmount } = renderHook(() => usePrefersReducedMotion());
    unmount();

    expect(removeListenerSpy).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
  });
});
