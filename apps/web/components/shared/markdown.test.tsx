import { render, screen } from "@testing-library/react";

import { Markdown } from "./markdown";

describe("markdown Component", () => {
  it("renders plain text correctly", () => {
    render(<Markdown>Hello world</Markdown>);
    expect(screen.getByText("Hello world")).toBeDefined();
  });

  it("renders bold text using strong tag", () => {
    const { container } = render(<Markdown>**Bold text**</Markdown>);
    const strongElement = container.querySelector("strong");
    expect(strongElement).toBeDefined();
    expect(strongElement?.textContent).toBe("Bold text");
    expect(strongElement?.className).toContain("font-bold");
  });

  it("renders links with security attributes", () => {
    const { container } = render(
      <Markdown>[Link text](https://example.com)</Markdown>
    );
    const linkElement = container.querySelector("a");
    expect(linkElement).toBeDefined();
    expect(linkElement?.getAttribute("href")).toBe("https://example.com");
    expect(linkElement?.getAttribute("target")).toBe("_blank");
    expect(linkElement?.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("renders lists with correct styling", () => {
    const markdown = `
- Item 1
- Item 2
    `;
    const { container } = render(<Markdown>{markdown}</Markdown>);
    const ulElement = container.querySelector("ul");
    expect(ulElement).toBeDefined();
    expect(ulElement?.className).toContain("list-disc");
    expect(screen.getByText("Item 1")).toBeDefined();
    expect(screen.getByText("Item 2")).toBeDefined();
  });

  it("renders paragraphs as spans by default", () => {
    const { container } = render(<Markdown>Paragraph text</Markdown>);
    const spanElement = container.querySelector("span");
    expect(spanElement).toBeDefined();
    expect(spanElement?.textContent).toBe("Paragraph text");
    // Ensure no p tags are rendered unless explicitly nested in a way that forces it (which react-markdown handles)
    // But our custom component overrides p to span
    expect(container.querySelector("p")).toBeNull();
  });
});
