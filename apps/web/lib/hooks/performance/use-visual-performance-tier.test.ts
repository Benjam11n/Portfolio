import { renderHook } from "@testing-library/react";

import {
  getInitialVisualPerformanceTier,
  useVisualPerformanceTier,
} from "./use-visual-performance-tier";

describe(getInitialVisualPerformanceTier, () => {
  it("uses the low tier for explicit or strong constraint signals", () => {
    expect(
      getInitialVisualPerformanceTier({ prefersReducedMotion: true })
    ).toBe("low");
    expect(getInitialVisualPerformanceTier({ saveData: true })).toBe("low");
    expect(getInitialVisualPerformanceTier({ hardwareConcurrency: 4 })).toBe(
      "low"
    );
    expect(getInitialVisualPerformanceTier({ deviceMemory: 4 })).toBe("low");
  });

  it("uses the medium tier for moderate hardware", () => {
    expect(getInitialVisualPerformanceTier({ hardwareConcurrency: 6 })).toBe(
      "medium"
    );
    expect(getInitialVisualPerformanceTier({ deviceMemory: 6 })).toBe("medium");
  });

  it("defaults capable and unknown devices to the high tier", () => {
    expect(
      getInitialVisualPerformanceTier({
        deviceMemory: 8,
        hardwareConcurrency: 8,
      })
    ).toBe("high");
    expect(getInitialVisualPerformanceTier({})).toBe("high");
  });

  it("reacts to the OS reduced-motion preference through the shared store", () => {
    const removeEventListener = vi.fn();
    vi.spyOn(window, "matchMedia").mockReturnValue({
      addEventListener: vi.fn(),
      matches: true,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      removeEventListener,
    } as unknown as MediaQueryList);

    const { result, unmount } = renderHook(() => useVisualPerformanceTier());

    expect(result.current).toBe("low");
    unmount();
    expect(removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
  });
});
