import { render, screen, waitFor } from "@repo/testing/test-utils";
import { fireEvent } from "@testing-library/react";

import { SelectiveHoverCursor } from "./selective-hover-cursor";

const mocks = vi.hoisted(() => ({
  gsapSet: vi.fn(),
  gsapTo: vi.fn((_: unknown, vars?: { onComplete?: () => void }) => {
    vars?.onComplete?.();
  }),
  prefersReducedMotion: false,
  quickToX: vi.fn(),
  quickToY: vi.fn(),
}));

vi.mock(import("@gsap/react"), () => ({
  useGSAP: (
    callbackOrConfig?: (() => void) | { scope?: unknown },
    config?: { scope?: unknown }
  ) => {
    if (typeof callbackOrConfig === "function") {
      callbackOrConfig();
    }

    return {
      contextSafe: <T extends (...args: unknown[]) => unknown>(fn: T) => fn,
      scope:
        typeof callbackOrConfig === "object"
          ? callbackOrConfig.scope
          : config?.scope,
    };
  },
}));

vi.mock(import("gsap"), () => ({
  default: {
    quickTo: vi.fn((_: Element, property: string) =>
      property === "x" ? mocks.quickToX : mocks.quickToY
    ),
    set: mocks.gsapSet,
    to: mocks.gsapTo,
  },
}));

vi.mock(import("@/lib/hooks/ui/use-prefers-reduced-motion"), () => ({
  usePrefersReducedMotion: () => mocks.prefersReducedMotion,
}));

const setPointerSupport = (matches: boolean) => {
  vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
    addEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    matches: query === "(hover: hover) and (pointer: fine)" ? matches : false,
    media: query,
    onchange: null,
    removeEventListener: vi.fn(),
  }));
};

let measuredScrollWidths = new Map<string, number>();

const normalizeText = (text: string | null) =>
  text?.replaceAll(/\s+/g, " ").trim() ?? "";

const setMeasuredScrollWidths = (widths: Record<string, number>) => {
  measuredScrollWidths = new Map(Object.entries(widths));
};

const getCursorBody = () =>
  document.querySelector(".selective-hover-cursor") as HTMLElement;

const expectCursorWidth = async (expectedWidth: number) => {
  await waitFor(() => {
    expect(getCursorBody().style.width).toBe(`${expectedWidth}px`);
  });
};

describe(SelectiveHoverCursor, () => {
  beforeAll(() => {
    vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockImplementation(
      function getMockScrollWidth(this: HTMLElement) {
        return measuredScrollWidths.get(normalizeText(this.textContent)) ?? 0;
      }
    );
  });

  beforeEach(() => {
    mocks.prefersReducedMotion = false;
    mocks.quickToX.mockReset();
    mocks.quickToY.mockReset();
    mocks.gsapTo.mockReset();
    mocks.gsapTo.mockImplementation(
      (_: unknown, vars?: { onComplete?: () => void }) => {
        vars?.onComplete?.();
      }
    );
    mocks.gsapSet.mockReset();
    setPointerSupport(true);
    setMeasuredScrollWidths({
      "Click me!": 44,
      "Learn more": 56,
      Tiny: 18,
      "Very long cursor label": 140,
      "View project": 70,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not render on coarse pointers", async () => {
    setPointerSupport(false);

    render(<SelectiveHoverCursor />);

    await waitFor(() => {
      expect(document.querySelector("[data-hover-cursor-overlay]")).toBeNull();
    });
  });

  it("does not render when reduced motion is enabled", async () => {
    mocks.prefersReducedMotion = true;

    render(<SelectiveHoverCursor />);

    await waitFor(() => {
      expect(document.querySelector("[data-hover-cursor-overlay]")).toBeNull();
    });
  });

  it("activates over marked targets and follows the pointer", async () => {
    render(
      <div>
        <button
          data-hover-cursor
          data-hover-cursor-label="Learn more"
          type="button"
        >
          Hover me
        </button>
        <SelectiveHoverCursor />
      </div>
    );

    const overlay = await waitFor(() => {
      const element = document.querySelector("[data-hover-cursor-overlay]");
      expect(element).toBeInTheDocument();
      return element as HTMLElement;
    });

    const hoverTarget = document.querySelector("[data-hover-cursor]");
    expect(hoverTarget).not.toBeNull();

    fireEvent.pointerMove(hoverTarget as Element, {
      clientX: 24,
      clientY: 36,
    });

    expect(overlay).toHaveAttribute("data-active", "true");
    expect(screen.getByText("Learn more")).toBeInTheDocument();
    expect(mocks.gsapSet).toHaveBeenCalledWith(overlay, {
      x: 36,
      y: 48,
    });
  });

  it("shrinks the label back into a dot when the label is cleared", async () => {
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

    await waitFor(() => {
      expect(
        document.querySelector("[data-hover-cursor-overlay]")
      ).toBeInTheDocument();
    });

    const hoverTarget = document.querySelector(
      "[data-hover-cursor]"
    ) as HTMLElement;

    fireEvent.pointerMove(hoverTarget, {
      clientX: 30,
      clientY: 42,
    });

    const label = screen.getByText("Click me!");
    expect(label).toHaveAttribute("data-visible", "true");

    hoverTarget.dataset.hoverCursorLabel = "";

    fireEvent.pointerMove(hoverTarget, {
      clientX: 34,
      clientY: 46,
    });

    expect(screen.getByText("Click me!")).toHaveAttribute(
      "data-visible",
      "false"
    );

    await waitFor(() => {
      expect(screen.queryByText("Click me!")).not.toBeInTheDocument();
    });
  });

  it("hides when moving onto an unmarked element", async () => {
    render(
      <div>
        <button
          data-hover-cursor
          data-hover-cursor-label="Learn more"
          type="button"
        >
          Hover me
        </button>
        <div>Plain text</div>
        <SelectiveHoverCursor />
      </div>
    );

    const overlay = await waitFor(() => {
      const element = document.querySelector("[data-hover-cursor-overlay]");
      expect(element).toBeInTheDocument();
      return element as HTMLElement;
    });

    const hoverTarget = document.querySelector("[data-hover-cursor]");
    expect(hoverTarget).not.toBeNull();

    fireEvent.pointerMove(hoverTarget as Element, {
      clientX: 12,
      clientY: 18,
    });
    expect(mocks.gsapTo).toHaveBeenCalledWith(
      overlay,
      expect.objectContaining({
        opacity: 1,
      })
    );

    fireEvent.pointerMove(screen.getByText("Plain text"), {
      clientX: 18,
      clientY: 24,
    });

    expect(overlay).toHaveAttribute("data-active", "false");
  });

  it("sizes the project cursor to its measured content on first hover", async () => {
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

    const hoverTarget = await waitFor(() => {
      const element = document.querySelector("[data-hover-cursor]");
      expect(element).toBeInTheDocument();
      return element as HTMLElement;
    });

    fireEvent.pointerMove(hoverTarget, {
      clientX: 20,
      clientY: 32,
    });

    await expectCursorWidth(110);
  });

  it("updates to the project width after hovering a shorter label", async () => {
    render(
      <div>
        <button data-hover-cursor data-hover-cursor-label="Tiny" type="button">
          Tiny
        </button>
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

    const hoverTargets = await waitFor(() => {
      const elements = document.querySelectorAll("[data-hover-cursor]");
      expect(elements).toHaveLength(2);
      return [...elements] as HTMLElement[];
    });

    fireEvent.pointerMove(hoverTargets[0], {
      clientX: 14,
      clientY: 26,
    });
    await expectCursorWidth(84);

    fireEvent.pointerMove(hoverTargets[1], {
      clientX: 22,
      clientY: 34,
    });

    await expectCursorWidth(110);
  });

  it("updates to the project width after hovering a longer label", async () => {
    render(
      <div>
        <button
          data-hover-cursor
          data-hover-cursor-label="Very long cursor label"
          type="button"
        >
          Long
        </button>
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

    const hoverTargets = await waitFor(() => {
      const elements = document.querySelectorAll("[data-hover-cursor]");
      expect(elements).toHaveLength(2);
      return [...elements] as HTMLElement[];
    });

    fireEvent.pointerMove(hoverTargets[0], {
      clientX: 16,
      clientY: 28,
    });
    await expectCursorWidth(180);

    fireEvent.pointerMove(hoverTargets[1], {
      clientX: 24,
      clientY: 36,
    });

    await expectCursorWidth(110);
  });
});
