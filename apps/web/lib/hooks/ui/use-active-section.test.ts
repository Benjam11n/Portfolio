import { createMockIntersectionEntry } from "@repo/testing/test-types";
import { act, renderHook, waitFor } from "@testing-library/react";

import { useActiveSection } from "./use-active-section";

const mockUsePathname = vi.fn();

vi.mock(import("next/navigation"), () => ({
  usePathname: () => mockUsePathname(),
}));

describe(useActiveSection, () => {
  let intersectionCallback: IntersectionObserverCallback;
  let observeSpy: ReturnType<typeof vi.fn>;
  let disconnectSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockUsePathname.mockReturnValue("/");
    document.body.innerHTML = `
      <section id="section1"></section>
      <section id="section2"></section>
      <section id="section3"></section>
    `;

    observeSpy = vi.fn();
    disconnectSpy = vi.fn();

    window.IntersectionObserver = class IntersectionObserver {
      readonly root: Element | Document | null = null;
      readonly rootMargin = "";
      readonly thresholds: number[] = [];

      constructor(callback: IntersectionObserverCallback) {
        intersectionCallback = callback;
      }

      observe = observeSpy;
      disconnect = disconnectSpy;
      takeRecords = vi.fn(() => []);
    } as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("initializes with the first section and observes each target section", () => {
    const { result } = renderHook(() =>
      useActiveSection(["section1", "section2", "section3"])
    );

    expect(result.current).toBe("section1");
    expect(observeSpy).toHaveBeenCalledWith(
      document.querySelector("#section1")
    );
    expect(observeSpy).toHaveBeenCalledWith(
      document.querySelector("#section2")
    );
    expect(observeSpy).toHaveBeenCalledWith(
      document.querySelector("#section3")
    );
  });

  it("updates to the most visible intersecting section", async () => {
    const { result } = renderHook(() =>
      useActiveSection(["section1", "section2", "section3"])
    );

    act(() => {
      intersectionCallback(
        [
          createMockIntersectionEntry({
            id: "section1",
            intersectionRatio: 0.2,
            isIntersecting: true,
          }),
          createMockIntersectionEntry({
            id: "section2",
            intersectionRatio: 0.9,
            isIntersecting: true,
          }),
        ],
        window.IntersectionObserver as unknown as IntersectionObserver
      );
    });

    await waitFor(() => {
      expect(result.current).toBe("section2");
    });
  });

  it("keeps the current section when every observed section becomes non-visible", async () => {
    const { result } = renderHook(() =>
      useActiveSection(["section1", "section2"])
    );

    act(() => {
      intersectionCallback(
        [
          createMockIntersectionEntry({
            id: "section1",
            intersectionRatio: 0.8,
            isIntersecting: true,
          }),
        ],
        window.IntersectionObserver as unknown as IntersectionObserver
      );
    });

    await waitFor(() => {
      expect(result.current).toBe("section1");
    });

    act(() => {
      intersectionCallback(
        [
          createMockIntersectionEntry({
            id: "section1",
            intersectionRatio: 0,
            isIntersecting: false,
          }),
          createMockIntersectionEntry({
            id: "section2",
            intersectionRatio: 0,
            isIntersecting: false,
          }),
        ],
        window.IntersectionObserver as unknown as IntersectionObserver
      );
    });

    expect(result.current).toBe("section1");
  });

  it("resets to the first section when the pathname changes", () => {
    const { result, rerender } = renderHook(() =>
      useActiveSection(["section1", "section2"])
    );

    act(() => {
      intersectionCallback(
        [
          createMockIntersectionEntry({
            id: "section2",
            intersectionRatio: 0.9,
            isIntersecting: true,
          }),
        ],
        window.IntersectionObserver as unknown as IntersectionObserver
      );
    });

    expect(result.current).toBe("section2");

    mockUsePathname.mockReturnValue("/projects/test");
    rerender();

    expect(result.current).toBe("section1");
  });

  it("returns null and skips observation when there are no sections", () => {
    const { result } = renderHook(() => useActiveSection([]));

    expect(result.current).toBeNull();
    expect(observeSpy).not.toHaveBeenCalled();
  });
});
