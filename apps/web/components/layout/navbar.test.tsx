import { render, screen } from "@repo/testing/test-utils";
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

    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Experience" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Projects" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Skills" })).toBeInTheDocument();
  });

  it("renders theme toggle", () => {
    render(<Navbar />);
    expect(
      screen.getByRole("button", { name: "Toggle Theme" })
    ).toBeInTheDocument();
  });
});
