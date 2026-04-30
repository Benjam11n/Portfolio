import { render, screen } from "@repo/testing/test-utils";

import { Navbar } from "./navbar";

const mockActiveSection = vi.fn();

vi.mock(import("@/lib/hooks/ui/use-active-section"), () => ({
  useActiveSection: () => mockActiveSection(),
}));

vi.mock(import("@/components/shared/theme-toggle"), () => ({
  ThemeToggle: () => <button type="button">Toggle Theme</button>,
}));

vi.mock(import("@/components/effects/magnetic"), () => ({
  Magnetic: ({ children }: { children: React.ReactNode }) => children,
}));

describe(Navbar, () => {
  beforeEach(() => {
    mockActiveSection.mockReturnValue("hero");
  });

  it("renders the navigation links and theme toggle", () => {
    render(<Navbar />);

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/"
    );
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute(
      "href",
      "/#projects"
    );
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/#contact"
    );
    expect(
      screen.getByRole("button", { name: "Toggle Theme" })
    ).toBeInTheDocument();
  });

  it("highlights the active section returned by the section-tracking hook", () => {
    mockActiveSection.mockReturnValue("projects");

    render(<Navbar />);

    expect(screen.getByRole("link", { name: "Projects" })).toHaveClass(
      "bg-primary/15"
    );
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveClass(
      "bg-primary/15"
    );
  });
});
