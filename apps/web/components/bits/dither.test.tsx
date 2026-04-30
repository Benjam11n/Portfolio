import { fireEvent, render } from "@testing-library/react";
import type { ComponentProps } from "react";

import { useElementVisibility } from "@/lib/hooks/ui/use-element-visibility";
import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";

import { Dither } from "./dither";

const canvasMock = vi.fn((_: unknown) => <div data-testid="canvas" />);
const setSkipAnimationsMock = vi.fn();

vi.mock(import("@react-three/fiber"), () => ({
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

vi.mock(import("next-themes"), () => ({
  useTheme: () => ({
    resolvedTheme: "light",
  }),
}));

vi.mock(import("@/lib/contexts/animation-skip-context"), () => ({
  useAnimationSkipContext: vi.fn(),
}));

vi.mock(import("@/lib/hooks/ui/use-element-visibility"), () => ({
  useElementVisibility: vi.fn(),
}));

vi.mock(import("@/lib/hooks/ui/use-prefers-reduced-motion"), () => ({
  usePrefersReducedMotion: vi.fn(),
}));

describe(Dither, () => {
  beforeEach(async () => {
    const { useAnimationSkipContext } =
      await import("@/lib/contexts/animation-skip-context");

    canvasMock.mockClear();
    setSkipAnimationsMock.mockReset();
    vi.mocked(useElementVisibility).mockReturnValue(true);
    vi.mocked(usePrefersReducedMotion).mockReturnValue(false);
    vi.mocked(useAnimationSkipContext).mockReturnValue({
      setSkipAnimations: setSkipAnimationsMock,
      skipAnimations: false,
    });
  });

  it("uses continuous rendering while the effect is visible and animated", () => {
    render(<Dither />);

    expect(canvasMock).toHaveBeenCalledWith(
      expect.objectContaining({ frameloop: "always" })
    );
  });

  it("stops rendering when the effect is hidden or reduced motion is preferred", () => {
    vi.mocked(useElementVisibility).mockReturnValue(false);

    render(<Dither />);

    expect(canvasMock).toHaveBeenCalledWith(
      expect.objectContaining({ frameloop: "never" })
    );
  });

  it("re-enables global animations when clicked while skip animations is active", async () => {
    const { useAnimationSkipContext } =
      await import("@/lib/contexts/animation-skip-context");

    vi.mocked(useAnimationSkipContext).mockReturnValue({
      setSkipAnimations: setSkipAnimationsMock,
      skipAnimations: true,
    });

    const { container } = render(<Dither />);

    fireEvent.click(container.firstElementChild as HTMLDivElement);

    expect(setSkipAnimationsMock).toHaveBeenCalledWith(false);
  });
});
