"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

import type { ClickSparkProps } from "@/components/bits/click-spark";
import type { DitherProps } from "@/components/bits/dither";

const loadConditionalNavbar = async () => {
  const mod = await import("@/components/layout/conditional-navbar");
  return mod.ConditionalNavbar;
};

const loadFooter = async () => {
  const mod = await import("@/components/layout/footer");
  return mod.Footer;
};

const loadDither = async () => {
  const mod = await import("@/components/bits/dither");
  return mod.Dither;
};

const loadClickSpark = async () => {
  const mod = await import("@/components/bits/click-spark");
  return mod.ClickSpark;
};

const loadSmoothScroll = async () => {
  const mod = await import("@/components/effects/smooth-scroll");
  return mod.SmoothScroll;
};

const loadSelectiveHoverCursor = async () => {
  const mod = await import("@/components/effects/selective-hover-cursor");
  return mod.SelectiveHoverCursor;
};

const loadAnimationSkipProvider = async () => {
  const mod = await import("@/lib/contexts/animation-skip-context");
  return mod.AnimationSkipProvider;
};

const loadPerformanceMonitor = async () => {
  const mod = await import("@/components/dev/performance-monitor");
  return mod.PerformanceMonitor;
};

export const DynamicNavbar = dynamic(loadConditionalNavbar, { ssr: false });

export const DynamicFooter = dynamic(loadFooter, { ssr: false });

export const DynamicDither: ComponentType<DitherProps> = dynamic(loadDither, {
  loading: () => <div className="h-full w-full bg-muted" />,
  ssr: true,
});

// Wrappers that contain content should typically NOT be ssr: false to preserve SEO and initial render
// However, we load them dynamically to reduce initial bundle size for the layout chunk
export const DynamicClickSpark: ComponentType<ClickSparkProps> = dynamic(
  loadClickSpark,
  { ssr: true }
);

export const DynamicSmoothScroll = dynamic(loadSmoothScroll, { ssr: true });

export const DynamicSelectiveHoverCursor = dynamic(loadSelectiveHoverCursor, {
  ssr: false,
});

export const DynamicAnimationSkipProvider = dynamic(loadAnimationSkipProvider, {
  ssr: true,
});

// Development-only performance monitor
export const DynamicPerformanceMonitor = dynamic(loadPerformanceMonitor, {
  ssr: false,
});
