import { render, screen } from "@repo/testing/test-utils";
import type { ReactNode } from "react";

import { LayoutShell } from "./layout-shell";

const mockVisualPerformanceTier = vi.fn();

vi.mock(
  import("@/lib/hooks/performance/use-deferred-enhancement") as unknown as string,
  () => ({
    useDeferredEnhancement: () => true,
  })
);

vi.mock(
  import("@/lib/hooks/performance/use-visual-performance-tier") as unknown as string,
  () => ({
    useVisualPerformanceTier: () => mockVisualPerformanceTier(),
  })
);

vi.mock(
  import("@/components/layout/dynamic-layout-components") as unknown as string,
  () => ({
    DynamicClickSpark: () => <div data-testid="click-spark" />,
    DynamicFooter: () => null,
    DynamicNavbar: () => null,
    DynamicSmoothScroll: ({ children }: { children: ReactNode }) => children,
  })
);

describe(LayoutShell, () => {
  beforeEach(() => {
    mockVisualPerformanceTier.mockReturnValue("high");
  });

  it("only mounts click sparks in the high tier", () => {
    mockVisualPerformanceTier.mockReturnValue("medium");

    render(<LayoutShell>Content</LayoutShell>);

    expect(screen.queryByTestId("click-spark")).not.toBeInTheDocument();
  });

  it("mounts click sparks on capable devices", () => {
    render(<LayoutShell>Content</LayoutShell>);

    expect(screen.getByTestId("click-spark")).toBeInTheDocument();
  });
});
