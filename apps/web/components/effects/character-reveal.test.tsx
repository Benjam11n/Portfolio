import { render, screen } from "@testing-library/react";

import { CharacterReveal } from "./character-reveal";

const animateInMock = vi.fn();
const setInitialStateMock = vi.fn();
const usePrefersReducedMotionMock = vi.fn();

vi.mock(import("@gsap/react") as unknown as string, () => ({
  useGSAP: (callback: () => void) => {
    callback();
    return { contextSafe: (fn: unknown) => fn };
  },
}));

vi.mock(import("gsap") as unknown as string, () => ({
  default: {
    set: vi.fn(),
    to: vi.fn(),
  },
}));

vi.mock(
  import("@/lib/hooks/ui/use-character-reveal") as unknown as string,
  () => ({
    useCharacterReveal: () => ({
      animateIn: animateInMock,
      setInitialState: setInitialStateMock,
    }),
  })
);

vi.mock(
  import("@/lib/hooks/ui/use-prefers-reduced-motion") as unknown as string,
  () => ({
    usePrefersReducedMotion: () => usePrefersReducedMotionMock(),
  })
);

describe(CharacterReveal, () => {
  beforeEach(() => {
    vi.useFakeTimers();
    animateInMock.mockReset();
    setInitialStateMock.mockReset();
    usePrefersReducedMotionMock.mockReturnValue(false);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders accessible text while hiding the animated characters from assistive tech", () => {
    const { container } = render(
      <CharacterReveal>Hello World</CharacterReveal>
    );

    expect(screen.getByText("Hello World")).toBeInTheDocument();
    expect(container.querySelector("[aria-hidden='true']")).toBeInTheDocument();
    expect(container.querySelector(".sr-only")).toHaveTextContent(
      "Hello World"
    );
  });

  it("splits text into character spans and preserves spaces", () => {
    const { container } = render(<CharacterReveal>Hi There</CharacterReveal>);

    expect(container.querySelectorAll(".char-reveal")).toHaveLength(8);
    expect(container.querySelector(".w-\\[0\\.25em\\]")).toBeInTheDocument();
  });

  it("runs the reveal sequence after the configured delay", () => {
    render(<CharacterReveal delay={0.2}>Hello</CharacterReveal>);

    expect(setInitialStateMock.mock.calls).toHaveLength(1);
    expect(animateInMock).not.toHaveBeenCalled();

    vi.advanceTimersByTime(200);

    expect(animateInMock.mock.calls).toHaveLength(1);
  });

  it("skips animation setup when reduced motion is preferred", () => {
    usePrefersReducedMotionMock.mockReturnValue(true);

    render(<CharacterReveal as="h1">Heading Text</CharacterReveal>);

    expect(
      screen.getByRole("heading", { name: "Heading Text" })
    ).toBeInTheDocument();
    expect(setInitialStateMock).not.toHaveBeenCalled();
    expect(animateInMock).not.toHaveBeenCalled();
  });
});
