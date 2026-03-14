import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAnimationFrame } from "./use-animation-frame";

describe("useAnimationFrame", () => {
  const requestAnimationFrameMock = vi.fn();
  const cancelAnimationFrameMock = vi.fn();

  beforeEach(() => {
    requestAnimationFrameMock.mockImplementation(() => 1);
    cancelAnimationFrameMock.mockImplementation(() => undefined);

    vi.stubGlobal("requestAnimationFrame", requestAnimationFrameMock);
    vi.stubGlobal("cancelAnimationFrame", cancelAnimationFrameMock);
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query) =>
        ({
          matches: false,
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as MediaQueryList
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("does not schedule animation frames when disabled", () => {
    renderHook(() =>
      useAnimationFrame(() => {
        // no-op
      }, { enabled: false })
    );

    expect(requestAnimationFrameMock).not.toHaveBeenCalled();
  });

  it("schedules animation frames when enabled", () => {
    renderHook(() =>
      useAnimationFrame(() => {
        // no-op
      }, { enabled: true })
    );

    expect(requestAnimationFrameMock).toHaveBeenCalled();
  });

  it("cancels the active animation frame when disabled after mount", () => {
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
