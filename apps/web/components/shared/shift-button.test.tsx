import { render, screen } from "@testing-library/react";

import { ShiftButton } from "./shift-button";

vi.mock(import("@/components/effects/shift-text") as unknown as string, () => ({
  ShiftText: ({ children }: { children: React.ReactNode }) => children,
  useShiftAnimation: () => ({
    animateIn: vi.fn(),
    animateOut: vi.fn(),
  }),
}));

describe(ShiftButton, () => {
  it("renders a link with its provided destination and label", () => {
    render(<ShiftButton href="/test">Link Button</ShiftButton>);

    expect(screen.getByRole("link", { name: /link button/i })).toHaveAttribute(
      "href",
      "/test"
    );
  });

  it("renders the optional icon and forwards external-link attributes", () => {
    render(
      <ShiftButton
        href="https://google.com"
        icon={<span data-testid="test-icon" />}
        rel="noopener noreferrer"
        target="_blank"
      >
        External
      </ShiftButton>
    );

    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /external/i })).toHaveAttribute(
      "target",
      "_blank"
    );
    expect(screen.getByRole("link", { name: /external/i })).toHaveAttribute(
      "rel",
      "noopener noreferrer"
    );
  });
});
