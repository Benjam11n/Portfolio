import { render, screen, waitFor } from "@repo/testing/test-utils";
import type { ComponentProps, ReactNode } from "react";

import { TechStack } from "./tech-stack";

vi.mock(import("next/dynamic"), () => ({
  default:
    () =>
    ({
      isOpen,
      onClose,
      tech,
    }: {
      isOpen: boolean;
      onClose: () => void;
      tech: { name: string };
    }) =>
      isOpen ? (
        <div data-testid="tech-detail-modal">
          <span>{tech.name}</span>
          <button onClick={onClose} type="button">
            Close
          </button>
        </div>
      ) : null,
}));

vi.mock(import("framer-motion"), () => ({
  AnimatePresence: ({ children }: { children: ReactNode }) => children,
  motion: {
    div: ({
      animate: _animate,
      exit: _exit,
      initial: _initial,
      layout: _layout,
      transition: _transition,
      children,
      ...props
    }: ComponentProps<"div"> & {
      animate?: unknown;
      exit?: unknown;
      initial?: unknown;
      layout?: unknown;
      transition?: unknown;
    }) => <div {...props}>{children}</div>,
    p: ({
      animate: _animate,
      exit: _exit,
      initial: _initial,
      layout: _layout,
      transition: _transition,
      children,
      ...props
    }: ComponentProps<"p"> & {
      animate?: unknown;
      exit?: unknown;
      initial?: unknown;
      layout?: unknown;
      transition?: unknown;
    }) => <p {...props}>{children}</p>,
    span: ({
      animate: _animate,
      exit: _exit,
      initial: _initial,
      layout: _layout,
      transition: _transition,
      children,
      ...props
    }: ComponentProps<"span"> & {
      animate?: unknown;
      exit?: unknown;
      initial?: unknown;
      layout?: unknown;
      transition?: unknown;
    }) => <span {...props}>{children}</span>,
  },
}));

vi.mock(import("@/components/shared/section-card"), () => ({
  SectionCard: ({
    children,
    id,
    title,
  }: {
    children: ReactNode;
    id: string;
    title: string;
  }) => (
    <section aria-label={title} id={id}>
      {children}
    </section>
  ),
}));

vi.mock(import("@/components/shared/tech-stack-item"), () => ({
  TechStackItem: ({
    onClick,
    stack,
  }: {
    onClick?: () => void;
    stack: { category: string; name: string };
  }) => (
    <button onClick={onClick} type="button">
      {stack.name} {stack.category}
    </button>
  ),
}));

vi.mock(import("@/lib/contexts/animation-skip-context"), () => ({
  useAnimationSkipContext: () => ({
    resetSkipAnimations: vi.fn(),
    setSkipAnimations: vi.fn(),
    skipAnimations: false,
  }),
}));

vi.mock(import("@/lib/hooks/ui/use-animation-skip-indicator"), () => ({
  useAnimationSkipIndicator: () => false,
}));

describe(TechStack, () => {
  const getRenderedTechButtons = () =>
    screen
      .getAllByRole("button")
      .filter((button) =>
        /\b(AI\/ML|Animation|Backend|Database|DevOps|Framework|Frontend|Language|Mobile|Styling)\b/.test(
          button.textContent ?? ""
        )
      );

  afterEach(() => {
    delete document.body.dataset.skillsDialogOpen;
  });

  it("shows only the initial visible technologies by default and expands on demand", async () => {
    const { user } = render(<TechStack />);

    expect(getRenderedTechButtons()).toHaveLength(12);
    expect(
      screen.getByRole("button", { name: /Docker DevOps/i })
    ).toBeDefined();
    expect(
      screen.queryByRole("button", { name: /Framer Animation/i })
    ).toBeNull();

    await user.click(screen.getByRole("button", { name: /See more/i }));

    await waitFor(() => {
      expect(getRenderedTechButtons()).toHaveLength(28);
      expect(
        screen.getByRole("button", { name: /Framer Animation/i })
      ).toBeDefined();
      expect(screen.getByRole("button", { name: /See less/i })).toBeDefined();
    });
  });

  it("filters, searches, sorts, and shows the empty state without changing behavior", async () => {
    const { user } = render(<TechStack />);

    expect(
      screen.getByRole("button", { name: /React Frontend/i })
    ).toBeDefined();
    expect(
      screen.getByRole("button", { name: /Docker DevOps/i })
    ).toBeDefined();

    await user.click(screen.getByRole("tab", { name: /Language/i }));

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /React Frontend/i })
      ).toBeNull();
      expect(
        screen.getByRole("button", { name: /TypeScript Language/i })
      ).toBeDefined();
    });

    await user.type(
      screen.getByRole("textbox", { name: "Search technologies" }),
      "java"
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Java Language/i })
      ).toBeDefined();
      expect(
        screen.getByRole("button", { name: /JavaScript Language/i })
      ).toBeDefined();
      expect(
        screen.queryByRole("button", { name: /TypeScript Language/i })
      ).toBeNull();
    });

    await user.clear(
      screen.getByRole("textbox", { name: "Search technologies" })
    );
    await user.click(
      screen.getByRole("button", { name: "Sort skills: Featured" })
    );
    await user.click(
      screen.getByRole("button", { name: "Sort skills: Skill Level Desc" })
    );

    await waitFor(() => {
      const languageButtons = screen
        .getAllByRole("button")
        .filter((button) => /\w+ Language/.test(button.textContent ?? ""));

      expect(languageButtons[0]).toHaveTextContent("Golang Language");
      expect(languageButtons.at(-1)).toHaveTextContent("TypeScript Language");
    });

    await user.click(screen.getByRole("tab", { name: /All/i }));
    await user.click(
      screen.getByRole("button", { name: "Sort skills: Skill Level Asc" })
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /See more/i })).toBeDefined();
      expect(getRenderedTechButtons()).toHaveLength(12);
    });

    await user.clear(
      screen.getByRole("textbox", { name: "Search technologies" })
    );
    await user.type(
      screen.getByRole("textbox", { name: "Search technologies" }),
      "zzzz"
    );

    await waitFor(() => {
      expect(screen.getByText("No technologies found.")).toBeDefined();
    });
  });

  it("toggles the skills dialog body dataset and close behavior identically", async () => {
    const { user } = render(<TechStack />);

    await user.click(screen.getByRole("button", { name: /React Frontend/i }));

    await waitFor(() => {
      expect(document.body.dataset.skillsDialogOpen).toBe("true");
      expect(screen.getByTestId("tech-detail-modal")).toBeDefined();
    });

    await user.click(screen.getByRole("button", { name: "Close" }));

    await waitFor(() => {
      expect(document.body.dataset.skillsDialogOpen).toBeUndefined();
      expect(screen.queryByTestId("tech-detail-modal")).toBeNull();
    });
  });
});
