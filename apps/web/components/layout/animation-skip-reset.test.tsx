import { render, screen } from "@repo/testing/test-utils";

import { AnimationSkipReset } from "./animation-skip-reset";

const mockUseAnimationSkipContext = vi.fn();

vi.mock(import("@/lib/contexts/animation-skip-context"), () => ({
  useAnimationSkipContext: () => mockUseAnimationSkipContext(),
}));

describe(AnimationSkipReset, () => {
  it("shows the running state by default", () => {
    mockUseAnimationSkipContext.mockReturnValue({
      skipAnimations: false,
    });

    render(<AnimationSkipReset />);

    const card = screen.getByText("Animations Running").closest("div");

    expect(card).toHaveClass("hidden");
    expect(card).toHaveClass("sm:flex");
    expect(screen.getByText("Esc")).toBeInTheDocument();
  });

  it("shows the paused state when animations are skipped", () => {
    mockUseAnimationSkipContext.mockReturnValue({
      skipAnimations: true,
    });

    render(<AnimationSkipReset />);

    expect(screen.getByText("Animations Paused")).toBeInTheDocument();
  });
});
