import { fireEvent, render } from "@testing-library/react";
import type { ComponentProps } from "react";

import { useElementVisibility } from "@/lib/hooks/ui/use-element-visibility";
import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";

import { Dither } from "./dither";

const canvasMock = vi.fn((_: unknown) => <div data-testid="canvas" />);
const setSkipAnimationsMock = vi.fn();

vi.mock(import("@react-three/fiber") as unknown as string, () => ({
  Canvas: (props: ComponentProps<"div"> & { frameloop: string }) => {
    canvasMock(props);
    return <div data-testid="canvas" />;
  },
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({
    gl: { getPixelRatio: () => 1 },
    invalidate: vi.fn(),
    size: { height: 100, width: 100 },
    viewport: { height: 1, width: 1 },
  })),
}));

vi.mock(import("next-themes") as unknown as string, () => ({
  useTheme: () => ({
    resolvedTheme: "light",
  }),
}));

vi.mock(
  import("@/lib/contexts/animation-skip-context") as unknown as string,
  () => ({
    useAnimationSkipContext: vi.fn(),
  })
);

vi.mock(
  import("@/lib/hooks/ui/use-element-visibility") as unknown as string,
  () => ({
    useElementVisibility: vi.fn(),
  })
);

vi.mock(import("@/lib/hooks/ui/use-prefers-reduced-motion"));

describe(Dither, () => {
  beforeEach(async () => {
    const { useAnimationSkipContext } =
      await import("@/lib/contexts/animation-skip-context");

    canvasMock.mockClear();
    setSkipAnimationsMock.mockReset();
    vi.mocked(useElementVisibility).mockReturnValue(true);
    vi.mocked(usePrefersReducedMotion).mockReturnValue(false);
    vi.mocked(useAnimationSkipContext).mockReturnValue({
      resetSkipAnimations: vi.fn(),
      setSkipAnimations: setSkipAnimationsMock,
      skipAnimations: false,
    });
  });

  it("uses demand rendering so frames can be capped", () => {
    render(<Dither />);

    expect(canvasMock).toHaveBeenCalledWith(
      expect.objectContaining({ frameloop: "demand" })
    );
  });

  it("stops scheduling frames when the effect is hidden", () => {
    vi.mocked(useElementVisibility).mockReturnValue(false);

    render(<Dither />);

    expect(canvasMock).toHaveBeenCalledWith(
      expect.objectContaining({
        children: expect.objectContaining({
          props: expect.objectContaining({ isActive: false }),
        }),
      })
    );
  });

  it("disables animation when reduced motion is preferred", () => {
    vi.mocked(usePrefersReducedMotion).mockReturnValue(true);

    render(<Dither />);

    expect(canvasMock).toHaveBeenCalledWith(
      expect.objectContaining({
        children: expect.objectContaining({
          props: expect.objectContaining({ disableAnimation: true }),
        }),
      })
    );
  });

  it("re-enables global animations when clicked while skip animations is active", async () => {
    const { useAnimationSkipContext } =
      await import("@/lib/contexts/animation-skip-context");

    vi.mocked(useAnimationSkipContext).mockReturnValue({
      resetSkipAnimations: vi.fn(),
      setSkipAnimations: setSkipAnimationsMock,
      skipAnimations: true,
    });

    const { container } = render(<Dither />);

    fireEvent.click(container.firstElementChild as HTMLDivElement);

    expect(setSkipAnimationsMock).toHaveBeenCalledWith(false);
  });
});
