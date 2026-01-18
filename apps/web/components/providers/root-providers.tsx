"use client";

import { AnalyticsProvider } from "@repo/analytics";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import {
  DynamicAnimationSkipProvider,
  DynamicPerformanceMonitor,
} from "@/components/layout/dynamic-layout-components";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { env } from "@/lib/env";

export function RootProviders({ children }: { children: ReactNode }) {
  return (
    <AnalyticsProvider
      disabled={!env.NEXT_PUBLIC_POSTHOG_KEY}
      host={env.NEXT_PUBLIC_POSTHOG_HOST}
      writeKey={env.NEXT_PUBLIC_POSTHOG_KEY ?? ""}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
      >
        <DynamicAnimationSkipProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
        </DynamicAnimationSkipProvider>
      </ThemeProvider>
      <DynamicPerformanceMonitor />
    </AnalyticsProvider>
  );
}
