import { fireEvent, render, screen } from "@testing-library/react";
import Link from "next/link";

import { Button } from "./button";

describe(Button, () => {
  it("renders a clickable button with its accessible name", () => {
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole("button", { name: /click me/i }));

    expect(handleClick.mock.calls).toHaveLength(1);
  });

  it("renders as a child link when requested", () => {
    render(
      <Button asChild>
        <Link href="/link">Link Button</Link>
      </Button>
    );

    expect(screen.getByRole("link", { name: /link button/i })).toHaveAttribute(
      "href",
      "/link"
    );
  });

  it("disables interaction and shows a spinner in the loading state", () => {
    const handleClick = vi.fn();

    render(
      <Button onClick={handleClick} variant="loading">
        Loading
      </Button>
    );

    const button = screen.getByRole("button", { name: /loading/i });

    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(button.querySelector("svg")).toBeInTheDocument();
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("keeps the success variant interactive", () => {
    const handleClick = vi.fn();

    render(
      <Button onClick={handleClick} variant="success">
        Success
      </Button>
    );

    const button = screen.getByRole("button", { name: /success/i });

    fireEvent.click(button);

    expect(button).not.toBeDisabled();
    expect(button.querySelector("svg")).toBeInTheDocument();
    expect(handleClick.mock.calls).toHaveLength(1);
  });
});
