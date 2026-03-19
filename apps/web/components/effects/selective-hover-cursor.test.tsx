import { render, screen, waitFor } from "@repo/testing/test-utils";
import { fireEvent } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  gsapSet: vi.fn(),
  gsapTo: vi.fn((_: unknown, vars?: { onComplete?: () => void }) => {
    vars?.onComplete?.();
  }),
  prefersReducedMotion: false,
  quickToX: vi.fn(),
  quickToY: vi.fn(),
}));

vi.mock("@gsap/react", () => ({
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

vi.mock("gsap", () => ({
  default: {
    quickTo: vi.fn((_: Element, property: string) =>
      property === "x" ? mocks.quickToX : mocks.quickToY
    ),
    set: mocks.gsapSet,
    to: mocks.gsapTo,
  },
}));

vi.mock("@/lib/hooks/ui/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => mocks.prefersReducedMotion,
}));

import { SelectiveHoverCursor } from "./selective-hover-cursor";

const setPointerSupport = (matches: boolean) => {
  vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
    matches: query === "(hover: hover) and (pointer: fine)" ? matches : false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

describe("SelectiveHoverCursor", () => {
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

    hoverTarget.setAttribute("data-hover-cursor-label", "");

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
        <button data-hover-cursor type="button">
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
    expect(overlay).toHaveAttribute("data-active", "true");

    fireEvent.pointerMove(screen.getByText("Plain text"), {
      clientX: 18,
      clientY: 24,
    });

    expect(overlay).toHaveAttribute("data-active", "false");
  });
});
