import { render, screen } from "@repo/testing/test-utils";

import { ProjectNavigation } from "./project-navigation";

const DISKNEE_LINK_REGEX = /disknee/i;
const DISKNEE_LOGO_REGEX =
  /DisKnee - Advanced Computer Vision Platform for Sports Medicine & Rehabilitation logo/i;

describe(ProjectNavigation, () => {
  it("renders the next project with logo and title", () => {
    render(<ProjectNavigation currentId="zucchini" />);

    expect(
      screen.getByRole("link", { name: DISKNEE_LINK_REGEX })
    ).toHaveAttribute("href", "/projects/disknee");
    expect(screen.getByAltText(DISKNEE_LOGO_REGEX)).toBeInTheDocument();
    expect(screen.getByText("DisKnee")).toBeInTheDocument();
  });

  it("wraps from the last project back to the first project", () => {
    render(<ProjectNavigation currentId="birds-of-a-feather" />);

    expect(screen.getByRole("link", { name: /zucchini/i })).toHaveAttribute(
      "href",
      "/projects/zucchini"
    );
    expect(
      screen.getByAltText(/Zucchini - Local-First Habit Tracker logo/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Zucchini")).toBeInTheDocument();
  });
});
