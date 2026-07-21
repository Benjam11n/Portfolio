import { renderHook } from "@testing-library/react";

import { useShouldReduceMotion } from "./use-should-reduce-motion";
import { useVisualPerformanceTier } from "./use-visual-performance-tier";

vi.mock(import("./use-visual-performance-tier"), () => ({
  useVisualPerformanceTier: vi.fn(),
}));

describe(useShouldReduceMotion, () => {
  it.each([
    ["high", false],
    ["medium", false],
    ["low", true],
  ] as const)("maps the %s tier to %s", (tier, expected) => {
    vi.mocked(useVisualPerformanceTier).mockReturnValue(tier);

    const { result } = renderHook(() => useShouldReduceMotion());

    expect(result.current).toBe(expected);
  });
});
