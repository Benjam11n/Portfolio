import { render } from "@testing-library/react";

import { LightweightMarkdown } from "./lightweight-markdown";

describe("lightweight markdown", () => {
  it("renders plain text correctly", () => {
    const { container } = render(
      <LightweightMarkdown>Hello world</LightweightMarkdown>
    );

    expect(container.textContent).toBe("Hello world");
  });

  it("renders bold text using strong tags", () => {
    const { container } = render(
      <LightweightMarkdown>**Bold text**</LightweightMarkdown>
    );

    const strongElement = container.querySelector("strong");
    expect(strongElement).toBeDefined();
    expect(strongElement?.textContent).toBe("Bold text");
  });

  it("renders links with security attributes", () => {
    const { container } = render(
      <LightweightMarkdown>
        [Link text](https://example.com)
      </LightweightMarkdown>
    );

    const linkElement = container.querySelector("a");
    expect(linkElement).toBeDefined();
    expect(linkElement?.getAttribute("href")).toBe("https://example.com");
    expect(linkElement?.getAttribute("target")).toBe("_blank");
    expect(linkElement?.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("supports mixed bold and link content", () => {
    const { container } = render(
      <LightweightMarkdown>
        Start **bold** and [link](https://example.com) end
      </LightweightMarkdown>
    );

    expect(container.textContent).toBe("Start bold and link end");
    expect(container.querySelector("strong")?.textContent).toBe("bold");
    expect(container.querySelector("a")?.textContent).toBe("link");
  });
});
