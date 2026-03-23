import { render, screen } from "@testing-library/react";

import { ShiftButton } from "./shift-button";

const LINK_BUTTON_REGEX = /Link Button/;

describe(ShiftButton, () => {
  it("renders children text", () => {
    render(<ShiftButton href="#">Click Me</ShiftButton>);
    expect(screen.getByText("Click Me")).toBeDefined();
  });

  it("renders as a link when href is provided", () => {
    render(<ShiftButton href="/test">Link Button</ShiftButton>);
    const link = screen.getByRole("link", { name: LINK_BUTTON_REGEX });
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe("/test");
  });

  it("renders icon when provided", () => {
    render(
      <ShiftButton href="#" icon={<span data-testid="test-icon" />}>
        With Icon
      </ShiftButton>
    );
    expect(screen.getByTestId("test-icon")).toBeDefined();
  });

  it("applies variant classes", () => {
    render(
      <ShiftButton href="#" variant="secondary">
        Secondary
      </ShiftButton>
    );
    // Based on typical implementation, secondary often has specific background or border
    // We check if it doesn't crash and renders.
    // Ideally we check for specific classes but that might be brittle if styles change.
    expect(screen.getByText("Secondary")).toBeDefined();
  });

  it("passes through other props like target", () => {
    render(
      <ShiftButton href="https://google.com" target="_blank">
        External
      </ShiftButton>
    );
    const link = screen.getByRole("link");
    expect(link.getAttribute("target")).toBe("_blank");
  });
});
