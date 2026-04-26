import { render, screen } from "@testing-library/react";

import { Footer } from "./footer";

// Mock GSAP
vi.mock(import("@gsap/react"), () => ({
  useGSAP: () => ({ contextSafe: (fn: unknown) => fn }),
}));

vi.mock(import("gsap/ScrollTrigger"), () => ({
  ScrollTrigger: {},
}));

vi.mock(import("gsap"), () => ({
  default: {
    registerPlugin: vi.fn(),
    timeline: () => ({
      from: vi.fn().mockReturnThis(),
    }),
  },
}));

const GITHUB_REGEX = /Github/i;
const CTA_REGEX = /Have A Question\?/i;
const NAME_REGEX = /Benjamin Wang/i;

describe(Footer, () => {
  it("renders call to action", () => {
    render(<Footer />);
    expect(
      screen.getByRole("heading", { name: CTA_REGEX })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Contact Me")).toBeInTheDocument();
  });

  it("hides call to action when disabled", () => {
    render(<Footer showCta={false} />);
    expect(
      screen.queryByRole("heading", { name: CTA_REGEX })
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Contact Me")).not.toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Footer />);
    expect(screen.getByText("Home")).toBeDefined();
    expect(screen.getByText("Experience")).toBeDefined();
  });

  it("renders social links", () => {
    render(<Footer />);
    expect(screen.getByText(GITHUB_REGEX)).toBeDefined();
    expect(screen.getByText("LinkedIn")).toBeDefined();
  });

  it("renders copyright", () => {
    render(<Footer />);
    expect(screen.getByText(NAME_REGEX)).toBeDefined();
  });

  it("renders privacy link only", () => {
    render(<Footer />);
    expect(
      screen.getByRole("link", { name: /privacy policy/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /terms of service/i })
    ).not.toBeInTheDocument();
  });
});
