import { render, screen } from "@repo/testing/test-utils";
import { describe, expect, it, vi } from "vitest";
import {
  HOVER_CURSOR_ATTRIBUTE,
  HOVER_CURSOR_LABEL_ATTRIBUTE,
} from "@/lib/constants/interaction";

// Mock GSAP for Card3D
vi.mock("@gsap/react", () => ({
  useGSAP: () => ({ contextSafe: (fn: unknown) => fn }),
}));

vi.mock("gsap", () => ({
  default: {
    to: vi.fn(),
  },
}));

import { TechStackItem } from "./tech-stack-item";

const mockStackItem = {
  name: "React",
  icon: "/react.png",
  category: "Frontend" as const,
  colorLight: "#fff",
  colorDark: "#000",
  proficiency: "expert" as const,
};

describe("TechStackItem", () => {
  it("renders icon", () => {
    render(<TechStackItem stack={mockStackItem} />);
    const img = screen.getByAltText("React");
    expect(img).toBeDefined();
    expect(img.getAttribute("src")).toContain("react.png");
  });

  it("renders tooltip trigger with accessible name", () => {
    render(<TechStackItem stack={mockStackItem} />);
    expect(screen.getByAltText("React")).toBeDefined();
  });

  it("renders in small mode", () => {
    render(<TechStackItem small stack={mockStackItem} />);
    expect(screen.getByAltText("React")).toBeDefined();
  });

  it("highlights matching search terms", () => {
    render(<TechStackItem searchTerms={["act"]} stack={mockStackItem} />);

    expect(screen.getByText("act").tagName).toBe("MARK");
  });

  it("adds the hover cursor label for clickable cards", () => {
    render(<TechStackItem onClick={vi.fn()} stack={mockStackItem} />);

    const button = screen.getByRole("button", {
      name: "View details for React",
    });

    expect(button).toHaveAttribute(HOVER_CURSOR_ATTRIBUTE, "");
    expect(button).toHaveAttribute(
      HOVER_CURSOR_LABEL_ATTRIBUTE,
      "Click me!"
    );
  });
});
