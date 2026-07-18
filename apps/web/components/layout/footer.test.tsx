import { act, render, screen } from "@testing-library/react";

import { Footer } from "./footer";

describe(Footer, () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-30T10:12:15.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders the contact CTA with the in-page contact destination", () => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: "Contact Me" })).toHaveAttribute(
      "href",
      "/#contact"
    );
    expect(
      screen.getByRole("heading", { name: /have a question\?/i })
    ).toBeInTheDocument();
  });

  it("omits the CTA when disabled", () => {
    const { container } = render(<Footer showCta={false} />);

    expect(
      screen.queryByRole("link", { name: "Contact Me" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /have a question\?/i })
    ).not.toBeInTheDocument();
    expect(container.querySelector(".border-t")).not.toBeInTheDocument();
  });

  it("renders the navigation, social, and legal links with expected destinations", () => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/"
    );
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute(
      "href",
      "/#projects"
    );
    expect(
      screen.getByRole("link", { name: "Privacy Policy" })
    ).toHaveAttribute("href", "/privacy");
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      "mailto:youcanfindbenjamin@gmail.com"
    );
    expect(screen.getByRole("link", { name: "Github" })).toHaveAttribute(
      "href",
      "https://github.com/Benjam11n"
    );
  });

  it("replaces the loading placeholder with the current local time", () => {
    render(<Footer />);

    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    expect(screen.getByText(/Benjamin Wang/)).toBeInTheDocument();
  });
});
