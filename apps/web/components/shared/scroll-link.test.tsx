import { fireEvent, render, screen } from "@repo/testing/test-utils";

import { ScrollLink } from "./scroll-link";

const mockUsePathname = vi.fn();

vi.mock(import("next/navigation"), () => ({
  usePathname: () => mockUsePathname(),
}));

describe(ScrollLink, () => {
  it("does not intercept same-page anchor clicks", () => {
    mockUsePathname.mockReturnValue("/");

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

  it("normalizes anchor hrefs when rendered off the home page", () => {
    mockUsePathname.mockReturnValue("/projects/test");

    render(<ScrollLink href="#contact">Contact</ScrollLink>);

    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/#contact"
    );
  });
});
