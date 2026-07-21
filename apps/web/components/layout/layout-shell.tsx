"use client";

import type { ReactNode } from "react";

import {
  DynamicClickSpark,
  DynamicFooter,
  DynamicNavbar,
  DynamicSmoothScroll,
} from "@/components/layout/dynamic-layout-components";
import { useDeferredEnhancement } from "@/lib/hooks/performance/use-deferred-enhancement";
import { useVisualPerformanceTier } from "@/lib/hooks/performance/use-visual-performance-tier";

interface LayoutShellProps {
  children: ReactNode;
  footerShowCta?: boolean;
}

export const LayoutShell = ({
  children,
  footerShowCta = true,
}: LayoutShellProps) => {
  const visualPerformanceTier = useVisualPerformanceTier();
  const enableClickSpark = useDeferredEnhancement({ delayMs: 1400 });
  const enableSmoothScroll = useDeferredEnhancement({
    activateOnInteraction: false,
    delayMs: 900,
  });

  return (
    <>
      {enableClickSpark && visualPerformanceTier === "high" && (
        <DynamicClickSpark
          className="pointer-events-none fixed inset-0 z-50"
          duration={400}
          listenOnDocument
          sparkCount={8}
          sparkRadius={20}
          sparkSize={10}
        />
      )}

      <div className="relative z-50 mx-4 w-full max-w-2xl overflow-hidden rounded-xl border border-border/40 bg-card shadow-xl sm:mx-8">
        <DynamicSmoothScroll enabled={enableSmoothScroll}>
          <main className="w-full" id="main-content">
            {children}
          </main>
        </DynamicSmoothScroll>
        <DynamicNavbar />
      </div>
      <div className="relative z-10 mx-4 w-full max-w-2xl sm:mx-8">
        <DynamicFooter showCta={footerShowCta} />
      </div>
    </>
  );
};
