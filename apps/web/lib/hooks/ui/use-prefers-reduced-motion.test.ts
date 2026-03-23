import type { EventListenerMap } from "@repo/testing/test-types";
import { act, renderHook } from "@testing-library/react";

import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

describe(usePrefersReducedMotion, () => {
  let matchMediaMock: ReturnType<typeof vi.fn>;
  let listeners: EventListenerMap;

  beforeEach(() => {
    listeners = {};

    matchMediaMock = vi.fn().mockImplementation((query: string) => ({
      addEventListener: vi.fn((event: string, callback: EventListener) => {
        if (!listeners[event]) {
          listeners[event] = [];
        }
        listeners[event].push(callback as (event: Event) => void);
      }),
      // Deprecated
      addListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matches: false,
      media: query,
      onchange: null,
      removeEventListener: vi.fn((event: string, callback: EventListener) => {
        if (listeners[event]) {
          listeners[event] = listeners[event].filter((cb) => cb !== callback);
        }
      }),
      // Deprecated
      removeListener: vi.fn(),
    }));

    window.matchMedia = matchMediaMock as unknown as typeof window.matchMedia;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return false by default (when no preference)", () => {
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBeFalsy();
  });

  it("should return true when media query matches", () => {
    matchMediaMock.mockImplementation((query: string) => ({
      addEventListener: vi.fn(),
      matches: true,
      media: query,
      removeEventListener: vi.fn(),
    }));

    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBeTruthy();
  });

  it("should update when preference changes", () => {
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBeFalsy();

    // Simulate change event
    act(() => {
      const changeHandler = listeners.change?.[0];
      if (changeHandler) {
        changeHandler({ matches: true } as MediaQueryListEvent);
      }
    });

    expect(result.current).toBeTruthy();

    // Change back
    act(() => {
      const changeHandler = listeners.change?.[0];
      if (changeHandler) {
        changeHandler({ matches: false } as MediaQueryListEvent);
      }
    });

    expect(result.current).toBeFalsy();
  });

  it("should cleanup event listener on unmount", () => {
    // We need to spy on the instance that will be returned by matchMedia
    const removeListenerSpy = vi.fn();
    matchMediaMock.mockImplementation((query: string) => ({
      addEventListener: vi.fn(),
      matches: false,
      media: query,
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
