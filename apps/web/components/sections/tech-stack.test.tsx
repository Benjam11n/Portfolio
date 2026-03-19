import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TechStack } from "./tech-stack";

const FRONTEND_BUTTON_REGEX = /Frontend/i;
const SEARCH_INPUT_REGEX = /Search tech stack/i;
const SKILL_LEVEL_BUTTON_REGEX = /Skill Level/i;

vi.mock("@/components/modals/tech-detail-modal", () => ({
  TechDetailModal: () => null,
}));

vi.mock("@/lib/contexts/animation-skip-context", () => ({
  useAnimationSkipContext: () => ({
    skipAnimations: false,
  }),
}));

vi.mock("@gsap/react", () => ({
  useGSAP: () => ({ contextSafe: (fn: unknown) => fn }),
}));

vi.mock("gsap", () => ({
  default: {
    to: vi.fn(),
  },
}));

describe("TechStack", () => {
  it("filters by category", async () => {
    const user = userEvent.setup();

    render(<TechStack />);

    await user.click(
      screen.getByRole("button", { name: FRONTEND_BUTTON_REGEX })
    );

    expect(
      screen.getByRole("button", { name: "View details for React" })
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: "View details for Postgres" })
      ).not.toBeInTheDocument();
    });
  });

  it("sorts by skill level", async () => {
    const user = userEvent.setup();

    render(<TechStack />);

    await user.click(
      screen.getByRole("button", { name: SKILL_LEVEL_BUTTON_REGEX })
    );

    const techButtons = screen
      .getAllByRole("button")
      .filter((button) =>
        button.getAttribute("aria-label")?.startsWith("View details for ")
      );

    const techNames = techButtons.map((button) =>
      button.getAttribute("aria-label")?.replace("View details for ", "")
    );

    expect(techNames.indexOf("React")).toBeLessThan(techNames.indexOf("Java"));
    expect(techNames.indexOf("TypeScript")).toBeLessThan(
      techNames.indexOf("MongoDB")
    );
  });

  it("highlights search matches", async () => {
    const user = userEvent.setup();

    const { container } = render(<TechStack />);

    await user.type(
      screen.getByRole("textbox", { name: SEARCH_INPUT_REGEX }),
      "react"
    );

    const highlightedMatches = Array.from(
      container.querySelectorAll("mark")
    ).map((mark) => mark.textContent);

    expect(highlightedMatches).toContain("React");
    expect(
      screen.getByRole("button", { name: "View details for React Query" })
    ).toBeInTheDocument();
  });
});
