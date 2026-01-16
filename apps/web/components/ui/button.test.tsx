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

  it("renders loading variant with spinner icon", () => {
    render(<Button variant="loading">Loading</Button>);
    const button = screen.getByRole("button", { name: /loading/i });
    expect(button).toBeDefined();
    expect(button).toBeDisabled();
    // Check for the Loader2 icon (svg with data-lucide="loader-2")
    const loaderIcon = button.querySelector('svg[data-lucide="loader-2"]');
    expect(loaderIcon).toBeDefined();
  });

  it("renders success variant with checkmark icon", () => {
    render(<Button variant="success">Success</Button>);
    const button = screen.getByRole("button", { name: /success/i });
    expect(button).toBeDefined();
    expect(button).not.toBeDisabled();
    // Check for the CheckCircle2 icon (svg with data-lucide="check-circle-2")
    const checkIcon = button.querySelector('svg[data-lucide="check-circle-2"]');
    expect(checkIcon).toBeDefined();
  });

  it("applies custom classes to loading variant", () => {
    render(
      <Button variant="loading" className="custom-class">
        Loading
      </Button>
    );
    const button = screen.getByRole("button", { name: /loading/i });
    expect(button.className).toContain("custom-class");
  });

  it("applies custom classes to success variant", () => {
    render(
      <Button variant="success" className="custom-class">
        Success
      </Button>
    );
    const button = screen.getByRole("button", { name: /success/i });
    expect(button.className).toContain("custom-class");
  });

  it("prevents clicks on loading button", () => {
    const handleClick = vi.fn();
    render(
      <Button variant="loading" onClick={handleClick}>
        Loading
      </Button>
    );
    const button = screen.getByRole("button", { name: /loading/i });
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("allows clicks on success button", () => {
    const handleClick = vi.fn();
    render(
      <Button variant="success" onClick={handleClick}>
        Success
      </Button>
    );
    const button = screen.getByRole("button", { name: /success/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
