import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Navbar } from "./navbar";

// Mock dependencies
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

vi.mock("@/components/shared/theme-toggle", () => ({
  ThemeToggle: () => <button type="button">Toggle Theme</button>,
}));

vi.mock("@/components/effects/magnetic", () => ({
  Magnetic: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("Navbar", () => {
  it("renders navigation items", () => {
    render(<Navbar />);

    // Check for Home, About, Experience, Projects
    expect(screen.getAllByText("Home").length).toBeGreaterThan(0);
    expect(screen.getAllByText("About").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Experience").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Projects").length).toBeGreaterThan(0);
  });

  it("renders theme toggle", () => {
    render(<Navbar />);
    expect(screen.getByText("Toggle Theme")).toBeDefined();
  });
});
