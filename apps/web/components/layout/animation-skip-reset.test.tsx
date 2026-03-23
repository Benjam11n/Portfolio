import { render, screen } from "@repo/testing/test-utils";

import { AnimationSkipReset } from "./animation-skip-reset";

vi.mock(import("@/lib/contexts/animation-skip-context"), () => ({
  useAnimationSkipContext: () => ({
    skipAnimations: false,
  }),
}));

describe(AnimationSkipReset, () => {
  it("is hidden on mobile and visible from the sm breakpoint up", () => {
    render(<AnimationSkipReset />);

    const card = screen.getByText("Animations Running").closest("div");

    expect(card).toHaveClass("hidden");
    expect(card).toHaveClass("sm:flex");
  });
});
