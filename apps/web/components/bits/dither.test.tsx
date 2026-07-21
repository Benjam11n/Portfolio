import { Canvas } from "@react-three/fiber";
import { fireEvent, render } from "@testing-library/react";

import { useAnimationSkipContext } from "@/lib/contexts/animation-skip-context";
import { useVisualPerformanceTier } from "@/lib/hooks/performance/use-visual-performance-tier";
import { useElementVisibility } from "@/lib/hooks/ui/use-element-visibility";

import { Dither } from "./dither";

const canvasMock = vi.mocked(Canvas);
const setSkipAnimationsMock = vi.fn();
const expectCanvasProps = (props: Record<string, unknown>) => {
  expect(canvasMock).toHaveBeenCalledWith(
    expect.objectContaining(props),
    undefined
  );
};

vi.mock(import("@react-three/fiber"));
vi.mock(import("next-themes"));
vi.mock(import("@/lib/contexts/animation-skip-context"));
vi.mock(import("@/lib/hooks/ui/use-element-visibility"));
vi.mock(import("@/lib/hooks/performance/use-visual-performance-tier"));

describe(Dither, () => {
  beforeEach(() => {
    canvasMock.mockClear();
    setSkipAnimationsMock.mockReset();
    vi.mocked(useElementVisibility).mockReturnValue(true);
    vi.mocked(useVisualPerformanceTier).mockReturnValue("high");
    vi.mocked(useAnimationSkipContext).mockReturnValue({
      resetSkipAnimations: vi.fn(),
      setSkipAnimations: setSkipAnimationsMock,
      skipAnimations: false,
    });
  });

  it("uses demand rendering so frames can be capped", () => {
    render(<Dither />);

    expectCanvasProps({ frameloop: "demand" });
  });

  it("reduces render resolution and frame rate in the medium tier", () => {
    vi.mocked(useVisualPerformanceTier).mockReturnValue("medium");

    render(<Dither />);

    expectCanvasProps({
      children: expect.objectContaining({
        props: expect.objectContaining({ framesPerSecond: 8 }),
      }),
      dpr: 0.35,
    });
  });

  it("stops scheduling frames when the effect is hidden", () => {
    vi.mocked(useElementVisibility).mockReturnValue(false);

    render(<Dither />);

    expectCanvasProps({
      children: expect.objectContaining({
        props: expect.objectContaining({ isActive: false }),
      }),
    });
  });

  it("disables animation in the low tier", () => {
    vi.mocked(useVisualPerformanceTier).mockReturnValue("low");

    render(<Dither />);

    expectCanvasProps({
      children: expect.objectContaining({
        props: expect.objectContaining({ disableAnimation: true }),
      }),
    });
  });

  it("re-enables global animations when clicked while skip animations is active", () => {
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
