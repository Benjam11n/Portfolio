import { render, screen } from "@testing-library/react";

import { Progress } from "./progress";

describe(Progress, () => {
  it("exposes the current progress semantics and computed fill width", () => {
    render(<Progress max={10} value={5} />);

    const progress = screen.getByRole("progressbar");

    expect(progress).toHaveAttribute("aria-valuemin", "0");
    expect(progress).toHaveAttribute("aria-valuemax", "10");
    expect(progress).toHaveAttribute("aria-valuenow", "5");
    expect(progress.firstElementChild).toHaveStyle({ width: "50%" });
  });

  it("clamps negative values to zero width", () => {
    render(<Progress value={-10} />);

    expect(screen.getByRole("progressbar").firstElementChild).toHaveStyle({
      width: "0%",
    });
  });

  it("clamps values larger than max to full width", () => {
    render(<Progress max={10} value={15} />);

    const progress = screen.getByRole("progressbar");

    expect(progress).toHaveAttribute("aria-valuenow", "15");
    expect(progress.firstElementChild).toHaveStyle({ width: "100%" });
  });

  it("uses the provided fill class override", () => {
    render(<Progress fillClassName="bg-red-500" value={50} />);

    expect(screen.getByRole("progressbar").firstElementChild).toHaveClass(
      "bg-red-500"
    );
  });

  it("uses the selected variant when no custom fill class is supplied", () => {
    render(<Progress value={50} variant="success" />);

    expect(screen.getByRole("progressbar").firstElementChild).toHaveClass(
      "bg-green-600"
    );
  });
});
