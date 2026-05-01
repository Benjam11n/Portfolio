import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ExperienceItem } from "./experience-item";

vi.mock(import("@gsap/react") as unknown as string, () => ({
  useGSAP: () => ({ contextSafe: (fn: unknown) => fn }),
}));

vi.mock(import("gsap") as unknown as string, () => ({
  default: {
    to: vi.fn(),
  },
}));

vi.mock(
  import("@/lib/hooks/utils/use-mobile-detection") as unknown as string,
  () => ({
    useMobileDetection: () => false,
  })
);

const mockExperience = {
  icon: "/company-logo.png",
  id: 1,
  name: "Test Company",
  points: [
    "Integrated **AI features** into the platform.",
    "improved performance by 50%.",
  ],
  pos: "Senior Developer",
  startDate: { month: 1 as const, year: 2023 },
};

const TEXT_INTEGRATED = /Integrated/;
const TEXT_IMPROVED = /improved performance by 50%/;

describe(ExperienceItem, () => {
  it("renders experience details", () => {
    render(<ExperienceItem item={mockExperience} />);
    expect(screen.getByText("Test Company")).toBeDefined();
    expect(screen.getByText("Senior Developer")).toBeDefined();
    expect(screen.getByText("Jan 2023 - Present")).toBeDefined();
  });

  it("renders markdown points accurately", () => {
    render(<ExperienceItem item={mockExperience} />);

    // Check for bold text rendering
    const strongText = screen.getByText("AI features");
    expect(strongText.tagName).toBe("STRONG");

    // Check for normal text
    expect(screen.getByText(TEXT_INTEGRATED)).toBeDefined();
    expect(screen.getByText(TEXT_IMPROVED)).toBeDefined();
  });

  it("renders list items", () => {
    render(<ExperienceItem item={mockExperience} />);
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(2);
  });

  it("shows a hover cursor label until the card is expanded", async () => {
    const user = userEvent.setup();
    render(<ExperienceItem item={mockExperience} />);

    const button = screen.getByRole("button", { name: "Test Company" });
    expect(button).toHaveAttribute("data-hover-cursor-label", "Click me!");

    await user.click(button);

    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(button).toHaveAttribute("data-hover-cursor-label", "");
  });
});
