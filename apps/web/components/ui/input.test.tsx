import { fireEvent, render, screen } from "@testing-library/react";

import { Input } from "./input";

describe(Input, () => {
  it("renders correctly", () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeDefined();
  });

  it("applies custom classes", () => {
    render(<Input className="custom-input" />);
    const input = screen.getByRole("textbox");
    expect(input.className).toContain("custom-input");
  });

  it("handles change events", () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test" } });
    expect(handleChange.mock.calls).toHaveLength(1);
  });

  it("renders with different types", () => {
    render(<Input placeholder="Password" type="password" />);
    const input = screen.getByPlaceholderText("Password");
    expect(input).toBeDefined();
    expect(input.getAttribute("type")).toBe("password");
  });

  it("is disabled when disabled prop is passed", () => {
    render(<Input disabled />);
    const input = screen.getByRole("textbox");
    expect(input).toBeDefined();
    expect(input.hasAttribute("disabled")).toBeTruthy();
  });
});
