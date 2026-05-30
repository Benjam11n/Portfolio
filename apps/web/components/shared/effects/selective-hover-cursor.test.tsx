import { render, screen, waitFor } from "@repo/testing/test-utils";
import { fireEvent } from "@testing-library/react";

import { SelectiveHoverCursor } from "./selective-hover-cursor";

const mocks = vi.hoisted(() => ({
  prefersReducedMotion: false,
}));

vi.mock(
  import("@/lib/hooks/ui/use-prefers-reduced-motion") as unknown as string,
  () => ({
    usePrefersReducedMotion: () => mocks.prefersReducedMotion,
  })
);

let currentElementFromPointTarget: Element | null = null;
let measuredScrollWidths = new Map<string, number>();

const normalizeText = (text: string | null) =>
  text?.replaceAll(/\s+/g, " ").trim() ?? "";

const setPointerSupport = (matches: boolean) => {
  vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
    addEventListener: vi.fn(),
    addListener: vi.fn(),
    dispatchEvent: vi.fn(),
    matches: query === "(hover: hover) and (pointer: fine)" ? matches : false,
    media: query,
    onchange: null,
    removeEventListener: vi.fn(),
    removeListener: vi.fn(),
  }));
};

const setMeasuredScrollWidths = (widths: Record<string, number>) => {
  measuredScrollWidths = new Map(Object.entries(widths));
};

const setElementFromPointTarget = (target: Element | null) => {
  currentElementFromPointTarget = target;
};

const getOverlay = () =>
  document.querySelector("[data-hover-cursor-overlay]") as HTMLElement | null;

const getCursorBody = () =>
  document.querySelector(".selective-hover-cursor") as HTMLElement;

const hover = (target: Element, clientX = 24, clientY = 36) => {
  setElementFromPointTarget(target);
  fireEvent.pointerMove(target, { clientX, clientY });
};

describe(SelectiveHoverCursor, () => {
  beforeAll(() => {
    vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockImplementation(
      function getMockScrollWidth(this: HTMLElement) {
        return measuredScrollWidths.get(normalizeText(this.textContent)) ?? 0;
      }
    );

    Object.defineProperty(document, "elementFromPoint", {
      configurable: true,
      value: vi.fn(() => currentElementFromPointTarget),
      writable: true,
    });
  });

  beforeEach(() => {
    mocks.prefersReducedMotion = false;
    setPointerSupport(true);
    setMeasuredScrollWidths({
      "Click me!": 44,
      Tiny: 18,
      "View project": 70,
    });
    setElementFromPointTarget(null);
  });

  it("does not render on coarse pointers", async () => {
    setPointerSupport(false);

    render(<SelectiveHoverCursor />);

    await waitFor(() => {
      expect(getOverlay()).toBeNull();
    });
  });

  it("does not render when reduced motion is enabled", async () => {
    mocks.prefersReducedMotion = true;

    render(<SelectiveHoverCursor />);

    await waitFor(() => {
      expect(getOverlay()).toBeNull();
    });
  });

  it("activates over marked targets and follows the pointer", async () => {
    render(
      <div>
        <button
          data-hover-cursor
          data-hover-cursor-label="Click me!"
          type="button"
        >
          Hover me
        </button>
        <SelectiveHoverCursor />
      </div>
    );

    const overlay = await waitFor(() => {
      expect(getOverlay()).toBeInTheDocument();
      return getOverlay() as HTMLElement;
    });
    const hoverTarget = screen.getByRole("button", { name: "Hover me" });

    hover(hoverTarget);

    expect(overlay).toHaveAttribute("data-active", "true");
    expect(overlay.style.transform).toContain("translate3d(36px, 48px, 0)");
    expect(screen.getByText("Click me!")).toHaveAttribute(
      "data-visible",
      "true"
    );
  });

  it("hides when moving onto an unmarked element", async () => {
    render(
      <div>
        <button
          data-hover-cursor
          data-hover-cursor-label="Click me!"
          type="button"
        >
          Hover me
        </button>
        <div>Plain text</div>
        <SelectiveHoverCursor />
      </div>
    );

    const overlay = await waitFor(() => {
      expect(getOverlay()).toBeInTheDocument();
      return getOverlay() as HTMLElement;
    });

    hover(screen.getByRole("button", { name: "Hover me" }));
    expect(overlay).toHaveAttribute("data-active", "true");

    hover(screen.getByText("Plain text"));

    expect(overlay).toHaveAttribute("data-active", "false");
  });

  it("uses the icon label width when showing a project action", async () => {
    render(
      <div>
        <button
          data-hover-cursor
          data-hover-cursor-icon="arrow-up-right"
          data-hover-cursor-label="View project"
          type="button"
        >
          Project
        </button>
        <SelectiveHoverCursor />
      </div>
    );

    hover(await screen.findByRole("button", { name: "Project" }));

    expect(screen.getByText("View project")).toHaveAttribute(
      "data-visible",
      "true"
    );
    await waitFor(() => {
      expect(getCursorBody().style.width).toBe("110px");
    });
  });

  it("shrinks back to a dot when a target clears its label", async () => {
    render(
      <div>
        <button data-hover-cursor data-hover-cursor-label="Tiny" type="button">
          Hover me
        </button>
        <SelectiveHoverCursor />
      </div>
    );

    const hoverTarget = screen.getByRole("button", { name: "Hover me" });

    hover(hoverTarget);
    await waitFor(() => {
      expect(getCursorBody().style.width).toBe("84px");
    });

    hoverTarget.dataset.hoverCursorLabel = "";
    hover(hoverTarget, 30, 42);

    expect(getCursorBody().style.width).toBe("18px");
    expect(screen.getByText("Tiny")).not.toHaveAttribute(
      "data-visible",
      "true"
    );
  });

  it("does not reuse a previous label for icon-only targets", async () => {
    render(
      <div>
        <button
          data-hover-cursor
          data-hover-cursor-label="Click me!"
          type="button"
        >
          Label target
        </button>
        <button
          data-hover-cursor
          data-hover-cursor-icon="arrow-up-right"
          type="button"
        >
          Icon target
        </button>
        <SelectiveHoverCursor />
      </div>
    );

    hover(screen.getByRole("button", { name: "Label target" }));
    expect(screen.getByText("Click me!")).toHaveAttribute(
      "data-visible",
      "true"
    );

    hover(screen.getByRole("button", { name: "Icon target" }));

    expect(screen.queryByText("Click me!")).not.toBeInTheDocument();
    await waitFor(() => {
      expect(getCursorBody().style.width).toBe("84px");
    });
  });

  it("syncs cursor state on scroll without pointer movement", async () => {
    render(
      <div>
        <button
          data-hover-cursor
          data-hover-cursor-label="Click me!"
          type="button"
        >
          Hover me
        </button>
        <div>Plain text</div>
        <SelectiveHoverCursor />
      </div>
    );

    const overlay = await waitFor(() => {
      expect(getOverlay()).toBeInTheDocument();
      return getOverlay() as HTMLElement;
    });

    hover(screen.getByText("Plain text"));
    expect(overlay).toHaveAttribute("data-active", "false");

    setElementFromPointTarget(screen.getByRole("button", { name: "Hover me" }));
    fireEvent.scroll(window);

    expect(overlay).toHaveAttribute("data-active", "true");
  });
});
