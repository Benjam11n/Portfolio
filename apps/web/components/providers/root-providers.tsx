"use client";

import { AnalyticsProvider } from "@repo/analytics";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

import {
  DynamicAnimationSkipProvider,
  DynamicPerformanceMonitor,
  DynamicSelectiveHoverCursor,
} from "@/components/layout/dynamic-layout-components";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { clientEnv } from "@/lib/env/client";
import { useDeferredEnhancement } from "@/lib/hooks/performance/use-deferred-enhancement";

export const RootProviders = ({ children }: { children: ReactNode }) => {
  const enableCursor = useDeferredEnhancement({ delayMs: 1400 });

  return (
    <AnalyticsProvider
      disabled={!clientEnv.NEXT_PUBLIC_POSTHOG_KEY}
      host={clientEnv.NEXT_PUBLIC_POSTHOG_HOST}
      writeKey={clientEnv.NEXT_PUBLIC_POSTHOG_KEY ?? ""}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
      >
        <DynamicAnimationSkipProvider>
          {enableCursor && <DynamicSelectiveHoverCursor />}
          <TooltipProvider delayDuration={60} skipDelayDuration={0}>
            {children}
          </TooltipProvider>
          <Toaster />
        </DynamicAnimationSkipProvider>
      </ThemeProvider>
      <DynamicPerformanceMonitor />
    </AnalyticsProvider>
  );
};
