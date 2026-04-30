import { render, screen } from "@testing-library/react";

import { Input } from "./input";

describe(Input, () => {
  it("renders semantic input attributes that callers depend on", () => {
    render(
      <Input aria-invalid="true" disabled placeholder="Email" type="email" />
    );

    const input = screen.getByPlaceholderText("Email");

    expect(input).toHaveAttribute("type", "email");
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("forwards refs to the underlying input element", () => {
    const ref = { current: null as HTMLInputElement | null };

    render(<Input ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
