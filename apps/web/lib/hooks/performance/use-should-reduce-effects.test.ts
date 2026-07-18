import { renderHook } from "@testing-library/react";

import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";

import { useShouldReduceEffects } from "./use-should-reduce-effects";

const mocks = vi.hoisted(() => ({
  isResourceConstrainedDevice: false,
}));

vi.mock(import("./use-resource-constrained-device"), () => ({
  useIsResourceConstrainedDevice: () => mocks.isResourceConstrainedDevice,
}));

vi.mock(import("@/lib/hooks/ui/use-prefers-reduced-motion"));

describe(useShouldReduceEffects, () => {
  beforeEach(() => {
    mocks.isResourceConstrainedDevice = false;
    vi.mocked(usePrefersReducedMotion).mockReturnValue(false);
  });

  it.each([
    { isResourceConstrainedDevice: true, prefersReducedMotion: false },
    { isResourceConstrainedDevice: false, prefersReducedMotion: true },
  ])("reduces effects when either signal is active", (signals) => {
    mocks.isResourceConstrainedDevice = signals.isResourceConstrainedDevice;
    vi.mocked(usePrefersReducedMotion).mockReturnValue(
      signals.prefersReducedMotion
    );

    const { result } = renderHook(useShouldReduceEffects);

    expect(result.current).toBeTruthy();
  });

  it("keeps effects when neither signal is active", () => {
    const { result } = renderHook(useShouldReduceEffects);

    expect(result.current).toBeFalsy();
  });
});
