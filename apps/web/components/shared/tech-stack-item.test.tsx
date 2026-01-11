import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TechStackItem } from "./tech-stack-item";

const mockStackItem = {
  name: "React",
  icon: "/react.png",
  category: "Frontend" as const,
  colorLight: "#fff",
  colorDark: "#000",
};

describe("TechStackItem", () => {
  it("renders icon", () => {
    render(
      <TooltipProvider>
        <TechStackItem stack={mockStackItem} />
      </TooltipProvider>
    );
    const img = screen.getByAltText("React");
    expect(img).toBeDefined();
    expect(img.getAttribute("src")).toContain("react.png");
  });

  it("renders tooltip trigger with accessible name", () => {
    // Tooltip trigger usually uses the content as labels
    render(
      <TooltipProvider>
        <TechStackItem stack={mockStackItem} />
      </TooltipProvider>
    );
    // The TooltipTrigger wraps the content.
    // We can check if the basic structure is there.
    expect(screen.getByAltText("React")).toBeDefined();
  });

  it("renders in small mode", () => {
    render(
      <TooltipProvider>
        <TechStackItem small stack={mockStackItem} />
      </TooltipProvider>
    );
    // Usually adds a specific class or style.
    // Verify it doesn't crash.
    expect(screen.getByAltText("React")).toBeDefined();
  });
});
