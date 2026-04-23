"use client";

import type { ReactNode } from "react";

import {
  DynamicClickSpark,
  DynamicDither,
  DynamicFooter,
  DynamicNavbar,
  DynamicSmoothScroll,
} from "@/components/layout/dynamic-layout-components";
import { useDeferredEnhancement } from "@/lib/hooks/performance/use-deferred-enhancement";

interface LayoutShellProps {
  children: ReactNode;
  footerShowCta?: boolean;
}

export const LayoutShell = ({
  children,
  footerShowCta = true,
}: LayoutShellProps) => {
  const enableDither = useDeferredEnhancement({
    activateOnInteraction: false,
    delayMs: 1600,
  });
  const enableClickSpark = useDeferredEnhancement({ delayMs: 1400 });
  const enableSmoothScroll = useDeferredEnhancement({
    activateOnInteraction: false,
    delayMs: 900,
  });

  return (
    <>
      {enableClickSpark && (
        <DynamicClickSpark
          className="pointer-events-none fixed inset-0 z-50"
          duration={400}
          listenOnDocument
          sparkCount={8}
          sparkRadius={20}
          sparkSize={10}
        />
      )}

      {enableDither && (
        <div className="fixed inset-0 z-0 h-full w-full opacity-70">
          <DynamicDither
            colorNum={3}
            disableAnimation={false}
            enableMouseInteraction
            mouseRadius={0.6}
            pixelSize={2}
            waveAmplitude={0.2}
            waveColor={undefined}
            waveFrequency={2}
            waveSpeed={0.04}
          />
        </div>
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
