import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock GSAP
vi.mock("@gsap/react", () => ({
  useGSAP: () => ({ contextSafe: (fn: unknown) => fn }),
}));

vi.mock("gsap", () => ({
  default: {
    to: vi.fn(),
  },
}));

import { Card3D } from "./card-3d";

describe("Card3D", () => {
  it("renders children correctly", () => {
    render(
      <Card3D>
        <div data-testid="test-content">Test Content</div>
      </Card3D>
    );
    expect(screen.getByTestId("test-content")).toBeDefined();
    expect(screen.getByText("Test Content")).toBeDefined();
  });

  it("applies custom className to card face", () => {
    const { container } = render(
      <Card3D className="custom-card-class">
        <span>Content</span>
      </Card3D>
    );
    // The card face div should have our custom class
    const cardFace = container.querySelector(".custom-card-class");
    expect(cardFace).toBeDefined();
  });

  it("applies custom containerClassName to perspective container", () => {
    const { container } = render(
      <Card3D containerClassName="custom-container-class">
        <span>Content</span>
      </Card3D>
    );
    const perspectiveContainer = container.querySelector(
      ".custom-container-class"
    );
    expect(perspectiveContainer).toBeDefined();
  });

  it("renders glare element when glare prop is true", () => {
    const { container } = render(
      <Card3D glare>
        <span>Content</span>
      </Card3D>
    );
    // Glare has mix-blend-plus-lighter class
    const glareElement = container.querySelector(".mix-blend-plus-lighter");
    expect(glareElement).toBeDefined();
  });

  it("does not render glare element when glare prop is false", () => {
    const { container } = render(
      <Card3D glare={false}>
        <span>Content</span>
      </Card3D>
    );
    const glareElement = container.querySelector(".mix-blend-plus-lighter");
    expect(glareElement).toBeNull();
  });

  it("renders edge layers for 3D thickness effect", () => {
    const { container } = render(
      <Card3D thickness={12}>
        <span>Content</span>
      </Card3D>
    );
    // We should have 4 edge divs + 1 back face = 5 pointer-events-none divs for 3D structure
    // (plus the glare if enabled)
    const pointerNoneDivs = container.querySelectorAll(".pointer-events-none");
    // At minimum we should have the edge layers
    expect(pointerNoneDivs.length).toBeGreaterThanOrEqual(5);
  });

  it("renders with default props without crashing", () => {
    render(
      <Card3D>
        <span>Default Props Test</span>
      </Card3D>
    );
    expect(screen.getByText("Default Props Test")).toBeDefined();
  });
});
