import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SmoothScroll } from "./smooth-scroll";

let mockPathname = "/";
let mockPrefersReducedMotion = false;

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

vi.mock("@/lib/hooks/ui/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => mockPrefersReducedMotion,
}));

describe("SmoothScroll", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockPathname = "/";
    mockPrefersReducedMotion = false;
    window.history.replaceState(null, "", "/");
    document.documentElement.style.scrollBehavior = "";
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
    window.history.replaceState(null, "", "/");
  });

  it("does not reset scroll position when reduced motion preference resolves", () => {
    const scrollToSpy = vi.spyOn(window, "scrollTo");

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

    vi.runAllTimers();

    expect(scrollToSpy).not.toHaveBeenCalled();
    expect(document.documentElement.style.scrollBehavior).toBe("auto");
  });

  it("scrolls to the current hash on the home page", () => {
    const scrollIntoView = vi.fn();
    vi.spyOn(document, "getElementById").mockReturnValue({
      scrollIntoView,
    } as unknown as HTMLElement);

    window.history.replaceState(null, "", "/#projects");

    render(
      <SmoothScroll>
        <div>Content</div>
      </SmoothScroll>
    );

    vi.runAllTimers();

    expect(document.getElementById).toHaveBeenCalledWith("projects");
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });
  });

  it("responds to hash changes on the home page without resetting to top", () => {
    const scrollIntoView = vi.fn();
    vi.spyOn(document, "getElementById").mockReturnValue({
      scrollIntoView,
    } as unknown as HTMLElement);

    render(
      <SmoothScroll>
        <div>Content</div>
      </SmoothScroll>
    );

    window.history.pushState(null, "", "/#contact");
    window.dispatchEvent(new HashChangeEvent("hashchange"));

    expect(document.getElementById).toHaveBeenCalledWith("contact");
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });
  });
});
