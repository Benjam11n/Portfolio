import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock GSAP
vi.mock("@gsap/react", () => ({
  useGSAP: () => ({ contextSafe: (fn: unknown) => fn }),
}));

vi.mock("gsap", () => ({
  default: {
    set: vi.fn(),
    to: vi.fn(),
  },
}));

// Mock hooks
vi.mock("@/lib/hooks/use-character-reveal", () => ({
  useCharacterReveal: () => ({
    setInitialState: vi.fn(),
    animateIn: vi.fn(),
  }),
}));

vi.mock("@/lib/hooks/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => false,
}));

import { CharacterReveal } from "./character-reveal";

describe("CharacterReveal", () => {
  it("renders children correctly", () => {
    render(<CharacterReveal>Hello World</CharacterReveal>);
    expect(screen.getByText("Hello World")).toBeDefined();
  });

  it("applies custom className to container", () => {
    const { container } = render(
      <CharacterReveal className="custom-class">Test</CharacterReveal>
    );
    const containerElement = container.querySelector(".custom-class");
    expect(containerElement).toBeDefined();
  });

  it("renders individual character spans", () => {
    const { container } = render(<CharacterReveal>Hi</CharacterReveal>);
    // Should have character reveal spans
    const charSpans = container.querySelectorAll(".char-reveal");
    expect(charSpans.length).toBe(2);
  });

  it("handles spaces correctly with w-[0.25em] class", () => {
    const { container } = render(
      <CharacterReveal>Hello World</CharacterReveal>
    );
    // Should have at least one space with the width class
    const spaceSpans = container.querySelectorAll(".w-\\[0\\.25em\\]");
    expect(spaceSpans.length).toBeGreaterThan(0);
  });

  it("renders screen reader only text", () => {
    const { container } = render(
      <CharacterReveal>Accessible Text</CharacterReveal>
    );
    // Should have sr-only span for screen readers
    const srOnlyElement = container.querySelector(".sr-only");
    expect(srOnlyElement).toBeDefined();
    expect(srOnlyElement?.textContent).toBe("Accessible Text");
  });

  it("renders with default props without crashing", () => {
    render(<CharacterReveal>Default Props Test</CharacterReveal>);
    expect(screen.getByText("Default Props Test")).toBeDefined();
  });

  it("renders as different element type when using 'as' prop", () => {
    const { container } = render(
      <CharacterReveal as="h1">Heading Text</CharacterReveal>
    );
    const heading = container.querySelector("h1");
    expect(heading).toBeDefined();
    expect(heading?.textContent).toContain("Heading Text");
  });

  it("has aria-hidden on animated characters span", () => {
    const { container } = render(<CharacterReveal>Test</CharacterReveal>);
    const animatedSpan = container.querySelector("[aria-hidden='true']");
    expect(animatedSpan).toBeDefined();
  });
});
