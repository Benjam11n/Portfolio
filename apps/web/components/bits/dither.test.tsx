import { render } from "@testing-library/react";
import type { ComponentProps } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const canvasMock = vi.fn((_: unknown) => <div data-testid="canvas" />);

vi.mock("@react-three/fiber", () => ({
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

vi.mock("@/lib/contexts/animation-skip-context", () => ({
  useAnimationSkipContext: () => ({
    skipAnimations: false,
    setSkipAnimations: vi.fn(),
  }),
}));

vi.mock("@/lib/hooks/ui/use-element-visibility", () => ({
  useElementVisibility: vi.fn(),
}));

vi.mock("@/lib/hooks/ui/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: vi.fn(() => false),
}));

import { useElementVisibility } from "@/lib/hooks/ui/use-element-visibility";
import { Dither } from "./dither";

describe("Dither", () => {
  beforeEach(() => {
    canvasMock.mockClear();
  });

  it("uses demand rendering while visible", () => {
    vi.mocked(useElementVisibility).mockReturnValue(true);

    render(<Dither />);

    expect(canvasMock).toHaveBeenCalledWith(
      expect.objectContaining({ frameloop: "demand" })
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
