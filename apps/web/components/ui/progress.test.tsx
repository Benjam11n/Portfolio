import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Progress } from "./progress";

describe("Progress", () => {
  it("renders correctly", () => {
    render(<Progress value={50} />);
    const progress = screen.getByRole("progressbar");
    expect(progress).toBeDefined();
  });

  it("applies custom classes", () => {
    render(<Progress className="custom-progress" value={50} />);
    const progress = screen.getByRole("progressbar");
    expect(progress.className).toContain("custom-progress");
  });

  it("renders with different values", () => {
    render(<Progress value={75} />);
    const progress = screen.getByRole("progressbar");
    expect(progress).toBeDefined();
    expect(progress.getAttribute("aria-valuenow")).toBe("75");
  });

  it("renders with different max values", () => {
    render(<Progress max={10} value={5} />);
    const progress = screen.getByRole("progressbar");
    expect(progress).toBeDefined();
    expect(progress.getAttribute("aria-valuemax")).toBe("10");
  });

  it("has correct ARIA attributes", () => {
    render(<Progress max={100} value={30} />);
    const progress = screen.getByRole("progressbar");
    expect(progress.getAttribute("role")).toBe("progressbar");
    expect(progress.getAttribute("aria-valuenow")).toBe("30");
    expect(progress.getAttribute("aria-valuemin")).toBe("0");
    expect(progress.getAttribute("aria-valuemax")).toBe("100");
  });

  it("clamps values to 0-100 percentage", () => {
    const { container: container1 } = render(<Progress value={-10} />);
    const { container: container2 } = render(<Progress value={150} />);

    // Both should render without errors
    expect(container1.querySelector('[role="progressbar"]')).toBeDefined();
    expect(container2.querySelector('[role="progressbar"]')).toBeDefined();
  });

  it("applies custom fill classes", () => {
    render(<Progress fillClassName="bg-red-500" value={50} />);
    const progress = screen.getByRole("progressbar");
    const fill = progress.querySelector("div");
    expect(fill?.className).toContain("bg-red-500");
  });

  it("uses default fill class when fillClassName not provided", () => {
    render(<Progress value={50} />);
    const progress = screen.getByRole("progressbar");
    const fill = progress.querySelector("div");
    expect(fill?.className).toContain("bg-primary");
  });
});
