import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Footer } from "./footer";

// Mock GSAP
vi.mock("@gsap/react", () => ({
  useGSAP: vi.fn(),
}));

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {},
}));

vi.mock("gsap", () => ({
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

describe("Footer", () => {
  it("renders call to action", () => {
    render(<Footer />);
    expect(
      screen.getByRole("heading", { name: CTA_REGEX })
    ).toBeInTheDocument();
    expect(screen.getAllByLabelText("Contact Me")).toHaveLength(2);
  });

  it("renders navigation links", () => {
    render(<Footer />);
    expect(screen.getByText("Home")).toBeDefined();
    expect(screen.getByText("Experience")).toBeDefined();
  });

  it("renders social links", () => {
    render(<Footer />);
    // Assuming CONTACT_INFO has GitHub and LinkedIn
    expect(screen.getByText(GITHUB_REGEX)).toBeDefined();
    expect(screen.getByText("LinkedIn")).toBeDefined();
  });

  it("renders copyright", () => {
    render(<Footer />);
    expect(screen.getByText(NAME_REGEX)).toBeDefined();
  });
});
