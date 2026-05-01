import { render, screen } from "@testing-library/react";

import { Card3D } from "./card-3d";

const usePrefersReducedMotionMock = vi.fn();
const useMobileDetectionMock = vi.fn();

vi.mock(import("@gsap/react") as unknown as string, () => ({
  useGSAP: () => ({ contextSafe: (fn: unknown) => fn }),
}));

vi.mock(import("gsap") as unknown as string, () => ({
  default: {
    to: vi.fn(),
  },
}));

vi.mock(
  import("@/lib/hooks/ui/use-prefers-reduced-motion") as unknown as string,
  () => ({
    usePrefersReducedMotion: () => usePrefersReducedMotionMock(),
  })
);

vi.mock(
  import("@/lib/hooks/utils/use-mobile-detection") as unknown as string,
  () => ({
    useMobileDetection: () => useMobileDetectionMock(),
  })
);

describe(Card3D, () => {
  beforeEach(() => {
    usePrefersReducedMotionMock.mockReturnValue(false);
    useMobileDetectionMock.mockReturnValue(false);
  });

  it("renders children inside the interactive card surface", () => {
    render(
      <Card3D>
        <div data-testid="test-content">Test Content</div>
      </Card3D>
    );

    expect(screen.getByTestId("test-content")).toHaveTextContent(
      "Test Content"
    );
  });

  it("falls back to the static card presentation when reduced motion is preferred", () => {
    usePrefersReducedMotionMock.mockReturnValue(true);

    const { container } = render(
      <Card3D containerClassName="container-class">
        <span>Content</span>
      </Card3D>
    );

    expect(container.querySelector(".container-class")).toBeInTheDocument();
    expect(
      container.querySelector("[role='presentation']")
    ).not.toBeInTheDocument();
  });

  it("uses subtle variant defaults without glare and lets explicit props override them", () => {
    const { container, rerender } = render(
      <Card3D variant="subtle">
        <span>Content</span>
      </Card3D>
    );

    expect(
      container.querySelector(".mix-blend-plus-lighter")
    ).not.toBeInTheDocument();

    rerender(
      <Card3D glare thickness={24} variant="subtle">
        <span>Content</span>
      </Card3D>
    );

    expect(
      container.querySelector(".mix-blend-plus-lighter")
    ).toBeInTheDocument();
    expect(
      container.querySelector('[style*="translateZ(12px)"]')
    ).toBeInTheDocument();
  });
});
