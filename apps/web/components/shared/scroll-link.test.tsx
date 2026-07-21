import { fireEvent, render, screen } from "@repo/testing/test-utils";
import { usePathname } from "next/navigation";

import { ScrollLink } from "./scroll-link";

vi.mock(import("next/navigation"));

describe(ScrollLink, () => {
  it("does not intercept first-time same-page anchor clicks", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    window.location.hash = "";

    const onClick = vi.fn();
    const querySelectorSpy = vi.spyOn(document, "querySelector");

    render(
      <ScrollLink href="#projects" onClick={onClick}>
        Projects
      </ScrollLink>
    );

    fireEvent.click(screen.getByRole("link", { name: "Projects" }));

    expect(onClick.mock.calls).toHaveLength(1);
    expect(querySelectorSpy).not.toHaveBeenCalled();
  });

  it("scrolls to the target when clicking the current hash again", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    window.location.hash = "#projects";

    const scrollIntoView = vi.fn();
    const target = document.createElement("section");
    target.id = "projects";
    target.scrollIntoView = scrollIntoView;

    const querySelectorSpy = vi
      .spyOn(document, "querySelector")
      .mockReturnValue(target);

    render(<ScrollLink href="#projects">Projects</ScrollLink>);

    fireEvent.click(screen.getByRole("link", { name: "Projects" }));

    expect(querySelectorSpy).toHaveBeenCalledWith("#projects");
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });
  });

  it("does nothing when the current hash target does not exist", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    window.location.hash = "#projects";

    const querySelectorSpy = vi
      .spyOn(document, "querySelector")
      .mockReturnValue(null);

    render(<ScrollLink href="#projects">Projects</ScrollLink>);

    fireEvent.click(screen.getByRole("link", { name: "Projects" }));

    expect(querySelectorSpy).toHaveBeenCalledWith("#projects");
  });

  it("does not force smooth scrolling when the click was already prevented", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    window.location.hash = "#projects";

    const onClick = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
    });
    const scrollIntoView = vi.fn();
    const target = document.createElement("section");
    target.scrollIntoView = scrollIntoView;
    vi.spyOn(document, "querySelector").mockReturnValue(target);

    render(
      <ScrollLink href="#projects" onClick={onClick}>
        Projects
      </ScrollLink>
    );

    fireEvent.click(screen.getByRole("link", { name: "Projects" }));

    expect(onClick.mock.calls).toHaveLength(1);
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it("normalizes anchor hrefs when rendered off the home page", () => {
    vi.mocked(usePathname).mockReturnValue("/projects/test");

    render(<ScrollLink href="#contact">Contact</ScrollLink>);

    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/#contact"
    );
  });
});
