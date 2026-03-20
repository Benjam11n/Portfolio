import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SmoothScroll } from "./smooth-scroll";

let mockPrefersReducedMotion = false;

vi.mock("@/lib/hooks/ui/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => mockPrefersReducedMotion,
}));

describe("SmoothScroll", () => {
  beforeEach(() => {
    mockPrefersReducedMotion = false;
    document.documentElement.style.scrollBehavior = "";
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.documentElement.style.scrollBehavior = "";
  });

  it("does not reset scroll position when reduced motion preference resolves", () => {
    const scrollToSpy = vi.spyOn(window, "scrollTo");
    const getElementByIdSpy = vi.spyOn(document, "getElementById");

    const { rerender } = render(
      <SmoothScroll>
        <div>Content</div>
      </SmoothScroll>
    );

    mockPrefersReducedMotion = true;

    rerender(
      <SmoothScroll>
        <div>Content</div>
      </SmoothScroll>
    );

    expect(scrollToSpy).not.toHaveBeenCalled();
    expect(getElementByIdSpy).not.toHaveBeenCalled();
    expect(document.documentElement.style.scrollBehavior).toBe("auto");
  });

  it("applies smooth scroll behavior when reduced motion is not preferred", () => {
    render(
      <SmoothScroll>
        <div>Content</div>
      </SmoothScroll>
    );

    expect(document.documentElement.style.scrollBehavior).toBe("smooth");
  });

  it("cleans up scroll behavior on unmount", () => {
    const { unmount } = render(
      <SmoothScroll>
        <div>Content</div>
      </SmoothScroll>
    );

    unmount();

    expect(document.documentElement.style.scrollBehavior).toBe("auto");
  });
});
