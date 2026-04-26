"use client";

import dynamic from "next/dynamic";

import type { ClickSparkProps } from "@/components/bits/click-spark";
import type { DitherProps } from "@/components/bits/dither";

export const DynamicNavbar = dynamic(
  async () => {
    const mod = await import("@/components/layout/conditional-navbar");
    return mod.ConditionalNavbar;
  },
  { ssr: false }
);

export const DynamicFooter = dynamic<{ showCta?: boolean }>(
  async () => {
    const mod = await import("@/components/layout/footer");
    return mod.Footer;
  },
  { ssr: false }
);

export const DynamicDither = dynamic<DitherProps>(
  async () => {
    const mod = await import("@/components/bits/dither");
    return mod.Dither;
  },
  {
    loading: () => <div className="h-full w-full bg-muted" />,
    ssr: true,
  }
);

export const DynamicClickSpark = dynamic<ClickSparkProps>(
  async () => {
    const mod = await import("@/components/bits/click-spark");
    return mod.ClickSpark;
  },
  { ssr: true }
);

export const DynamicSmoothScroll = dynamic(
  async () => {
    const mod = await import("@/components/effects/smooth-scroll");
    return mod.SmoothScroll;
  },
  { ssr: true }
);

export const DynamicSelectiveHoverCursor = dynamic(
  async () => {
    const mod = await import("@/components/effects/selective-hover-cursor");
    return mod.SelectiveHoverCursor;
  },
  { ssr: false }
);

export const DynamicAnimationSkipProvider = dynamic(
  async () => {
    const mod = await import("@/lib/contexts/animation-skip-context");
    return mod.AnimationSkipProvider;
  },
  { ssr: true }
);

export const DynamicPerformanceMonitor = dynamic(
  async () => {
    const mod = await import("@/components/dev/performance-monitor");
    return mod.PerformanceMonitor;
  },
  { ssr: false }
);
