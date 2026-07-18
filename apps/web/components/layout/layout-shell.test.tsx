import { render, screen } from "@repo/testing/test-utils";
import type { ReactNode } from "react";

import { LayoutShell } from "./layout-shell";

const mockShouldReduceEffects = vi.fn();

vi.mock(
  import("@/lib/hooks/performance/use-deferred-enhancement") as unknown as string,
  () => ({ useDeferredEnhancement: () => true })
);

vi.mock(
  import("@/lib/hooks/performance/use-should-reduce-effects") as unknown as string,
  () => ({
    useShouldReduceEffects: () => mockShouldReduceEffects(),
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
    mockShouldReduceEffects.mockReturnValue(false);
  });

  it("does not mount click sparks on resource-constrained devices", () => {
    mockShouldReduceEffects.mockReturnValue(true);

    render(<LayoutShell>Content</LayoutShell>);

    expect(screen.queryByTestId("click-spark")).not.toBeInTheDocument();
  });

  it("mounts click sparks on capable devices", () => {
    render(<LayoutShell>Content</LayoutShell>);

    expect(screen.getByTestId("click-spark")).toBeInTheDocument();
  });
});
