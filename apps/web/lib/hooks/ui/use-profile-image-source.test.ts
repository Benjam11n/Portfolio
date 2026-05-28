import { act, renderHook } from "@testing-library/react";
import { createRef } from "react";

import { useProfileImageSource } from "./use-profile-image-source";

const mocks = vi.hoisted(() => ({
  fromTo: vi.fn(),
  resolvedTheme: "dark" as string | undefined,
}));

vi.mock(import("next-themes") as unknown as string, () => ({
  useTheme: () => ({ resolvedTheme: mocks.resolvedTheme }),
}));

vi.mock(import("gsap") as unknown as string, () => ({
  default: {
    fromTo: mocks.fromTo,
  },
}));

describe(useProfileImageSource, () => {
  beforeEach(() => {
    mocks.fromTo.mockClear();
    mocks.resolvedTheme = "dark";
  });

  it("uses the dark image by default", () => {
    const { result } = renderHook(() => useProfileImageSource());

    expect(result.current).toBe("/benjamin.avif");
    expect(mocks.fromTo).not.toHaveBeenCalled();
  });

  it("uses the light image after hydration when the resolved theme is light", () => {
    mocks.resolvedTheme = "light";

    const { result } = renderHook(() => useProfileImageSource());

    expect(result.current).toBe("/benjamin-light.avif");
  });

  it("animates the supplied element when the theme changes", () => {
    const animationRef = createRef<HTMLDivElement>();
    animationRef.current = document.createElement("div");

    const { rerender } = renderHook(() =>
      useProfileImageSource({ animationRef })
    );

    expect(mocks.fromTo).not.toHaveBeenCalled();

    act(() => {
      mocks.resolvedTheme = "light";
      rerender();
    });

    expect(mocks.fromTo).toHaveBeenCalledWith(
      animationRef.current,
      {
        autoAlpha: 0.8,
        scale: 0.96,
        y: 4,
      },
      {
        autoAlpha: 1,
        duration: 0.28,
        ease: "power2.out",
        overwrite: "auto",
        scale: 1,
        y: 0,
      }
    );
  });

  it("does not animate theme changes when reduced motion is preferred", () => {
    const animationRef = createRef<HTMLDivElement>();
    animationRef.current = document.createElement("div");

    const { rerender } = renderHook(() =>
      useProfileImageSource({ animationRef, prefersReducedMotion: true })
    );

    act(() => {
      mocks.resolvedTheme = "light";
      rerender();
    });

    expect(mocks.fromTo).not.toHaveBeenCalled();
  });
});
