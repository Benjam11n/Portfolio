import { render, screen } from "@repo/testing/test-utils";

import { Navbar } from "./navbar";

const mockActiveSection = vi.fn();
const mockShouldReduceEffects = vi.fn();

vi.mock(
  import("@/lib/hooks/performance/use-should-reduce-effects") as unknown as string,
  () => ({
    useShouldReduceEffects: () => mockShouldReduceEffects(),
  })
);

vi.mock(
  import("@/lib/hooks/ui/use-active-section") as unknown as string,
  () => ({
    useActiveSection: () => mockActiveSection(),
  })
);

vi.mock(
  import("@/components/shared/theme-toggle") as unknown as string,
  () => ({
    ThemeToggle: () => <button type="button">Toggle Theme</button>,
  })
);

vi.mock(import("@/components/effects/magnetic") as unknown as string, () => ({
  Magnetic: ({ children }: { children: React.ReactNode }) => children,
}));

describe(Navbar, () => {
  beforeEach(() => {
    mockActiveSection.mockReturnValue("hero");
    mockShouldReduceEffects.mockReturnValue(false);
  });

  it("removes backdrop blur on resource-constrained devices", () => {
    mockShouldReduceEffects.mockReturnValue(true);

    render(<Navbar />);

    expect(screen.getByRole("navigation")).toHaveClass("bg-secondary");
    expect(screen.getByRole("navigation")).not.toHaveClass("backdrop-blur-lg");
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
