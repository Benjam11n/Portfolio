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

const WORK_REGEX = /Let's Work/i;
const NAME_REGEX = /Benjamin Wang/i;

describe("Footer", () => {
  it("renders call to action", () => {
    render(<Footer />);
    expect(screen.getByText(WORK_REGEX)).toBeDefined();
    expect(screen.getByLabelText("Contact Me")).toBeDefined();
  });

  it("renders navigation links", () => {
    render(<Footer />);
    expect(screen.getByText("Home")).toBeDefined();
    expect(screen.getByText("Experience")).toBeDefined();
  });

  const GITHUB_REGEX = /Github/i;

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
