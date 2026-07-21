import { render, screen } from "@testing-library/react";

import { useShouldReduceMotion } from "@/lib/hooks/performance/use-should-reduce-motion";
import { useIsSafari } from "@/lib/hooks/utils/use-is-safari";
import { useMobileDetection } from "@/lib/hooks/utils/use-mobile-detection";

import { Card3D } from "./card-3d";

vi.mock(import("@/lib/hooks/performance/use-should-reduce-motion"));
vi.mock(import("@/lib/hooks/utils/use-is-safari"));
vi.mock(import("@/lib/hooks/utils/use-mobile-detection"));

describe(Card3D, () => {
  beforeEach(() => {
    vi.mocked(useIsSafari).mockReturnValue(false);
    vi.mocked(useMobileDetection).mockReturnValue(false);
    vi.mocked(useShouldReduceMotion).mockReturnValue(false);
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
    vi.mocked(useShouldReduceMotion).mockReturnValue(true);

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

  it("falls back to the static card presentation in Apple WebKit browsers", () => {
    vi.mocked(useIsSafari).mockReturnValue(true);

    const { container } = render(
      <Card3D>
        <span>Content</span>
      </Card3D>
    );

    expect(
      container.querySelector("[role='presentation']")
    ).not.toBeInTheDocument();
    expect(screen.getByText("Content")).toBeVisible();
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
      container.querySelector('[style*="translateY(12px)"]')
    ).toBeInTheDocument();
  });
});
