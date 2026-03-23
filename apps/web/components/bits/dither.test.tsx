import { render } from "@testing-library/react";
import type { ComponentProps } from "react";

import { useElementVisibility } from "@/lib/hooks/ui/use-element-visibility";

import { Dither } from "./dither";

const canvasMock = vi.fn((_: unknown) => <div data-testid="canvas" />);

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

vi.mock(import("@/lib/contexts/animation-skip-context"), () => ({
  useAnimationSkipContext: () => ({
    setSkipAnimations: vi.fn(),
    skipAnimations: false,
  }),
}));

vi.mock(import("@/lib/hooks/ui/use-element-visibility"), () => ({
  useElementVisibility: vi.fn(),
}));

vi.mock(import("@/lib/hooks/ui/use-prefers-reduced-motion"), () => ({
  usePrefersReducedMotion: vi.fn(() => false),
}));

describe(Dither, () => {
  beforeEach(() => {
    canvasMock.mockClear();
  });

  it("uses continuous rendering while active", () => {
    vi.mocked(useElementVisibility).mockReturnValue(true);

    render(<Dither />);

    expect(canvasMock).toHaveBeenCalledWith(
      expect.objectContaining({ frameloop: "always" })
    );
  });

  it("stops rendering when hidden", () => {
    vi.mocked(useElementVisibility).mockReturnValue(false);

    render(<Dither />);

    expect(canvasMock).toHaveBeenCalledWith(
      expect.objectContaining({ frameloop: "never" })
    );
  });
});
