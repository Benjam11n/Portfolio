import { render } from "@testing-library/react";

import { useShouldReduceMotion } from "@/lib/hooks/performance/use-should-reduce-motion";

import { SmoothScroll } from "./smooth-scroll";

vi.mock(import("@/lib/hooks/performance/use-should-reduce-motion"));

describe(SmoothScroll, () => {
  beforeEach(() => {
    vi.mocked(useShouldReduceMotion).mockReturnValue(false);
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

    vi.mocked(useShouldReduceMotion).mockReturnValue(true);

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
