import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./button";

const CLICK_ME_REGEX = /click me/i;
const LINK_BUTTON_REGEX = /link button/i;

describe("Button", () => {
  it("renders correctly", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: CLICK_ME_REGEX });
    expect(button).toBeDefined();
  });

  it("applies custom classes", () => {
    render(<Button className="custom-class">Click me</Button>);
    const button = screen.getByRole("button", { name: CLICK_ME_REGEX });
    expect(button.className).toContain("custom-class");
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole("button", { name: CLICK_ME_REGEX });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders as a child (Slot) when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/link">Link Button</a>
      </Button>
    );
    const link = screen.getByRole("link", { name: LINK_BUTTON_REGEX });
    expect(link).toBeDefined();
    expect(link.className).toContain("inline-flex"); // Should still have button classes
  });
});
