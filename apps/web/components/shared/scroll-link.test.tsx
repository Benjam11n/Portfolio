import { fireEvent, render, screen } from "@repo/testing/test-utils";

import { ScrollLink } from "./scroll-link";

const mockUsePathname = vi.fn();

vi.mock(import("next/navigation"), () => ({
  usePathname: () => mockUsePathname(),
}));

describe(ScrollLink, () => {
  it("does not intercept first-time same-page anchor clicks", () => {
    mockUsePathname.mockReturnValue("/");
    window.location.hash = "";

    const onClick = vi.fn();
    const getElementByIdSpy = vi.spyOn(document, "getElementById");

    render(
      <ScrollLink href="#projects" onClick={onClick}>
        Projects
      </ScrollLink>
    );

    fireEvent.click(screen.getByRole("link", { name: "Projects" }));

    expect(onClick.mock.calls).toHaveLength(1);
    expect(getElementByIdSpy).not.toHaveBeenCalled();
  });

  it("scrolls to the target when clicking the current hash again", () => {
    mockUsePathname.mockReturnValue("/");
    window.location.hash = "#projects";

    const scrollIntoView = vi.fn();
    const target = document.createElement("section");
    target.id = "projects";
    target.scrollIntoView = scrollIntoView;

    const getElementByIdSpy = vi
      .spyOn(document, "getElementById")
      .mockReturnValue(target);

    render(<ScrollLink href="#projects">Projects</ScrollLink>);

    fireEvent.click(screen.getByRole("link", { name: "Projects" }));

    expect(getElementByIdSpy).toHaveBeenCalledWith("projects");
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });
  });

  it("normalizes anchor hrefs when rendered off the home page", () => {
    mockUsePathname.mockReturnValue("/projects/test");

    render(<ScrollLink href="#contact">Contact</ScrollLink>);

    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/#contact"
    );
  });
});
