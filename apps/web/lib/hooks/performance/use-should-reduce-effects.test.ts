import { renderHook } from "@testing-library/react";

import { useShouldReduceEffects } from "./use-should-reduce-effects";

const mocks = vi.hoisted(() => ({
  isResourceConstrainedDevice: false,
  prefersReducedMotion: false,
}));

vi.mock(
  import("./use-resource-constrained-device") as unknown as string,
  () => ({
    useIsResourceConstrainedDevice: () => mocks.isResourceConstrainedDevice,
  })
);

vi.mock(
  import("@/lib/hooks/ui/use-prefers-reduced-motion") as unknown as string,
  () => ({
    usePrefersReducedMotion: () => mocks.prefersReducedMotion,
  })
);

describe(useShouldReduceEffects, () => {
  beforeEach(() => {
    mocks.isResourceConstrainedDevice = false;
    mocks.prefersReducedMotion = false;
  });

  it.each([
    { isResourceConstrainedDevice: true, prefersReducedMotion: false },
    { isResourceConstrainedDevice: false, prefersReducedMotion: true },
  ])("reduces effects when either signal is active", (signals) => {
    Object.assign(mocks, signals);

    const { result } = renderHook(useShouldReduceEffects);

    expect(result.current).toBeTruthy();
  });

  it("keeps effects when neither signal is active", () => {
    const { result } = renderHook(useShouldReduceEffects);

    expect(result.current).toBeFalsy();
  });
});
