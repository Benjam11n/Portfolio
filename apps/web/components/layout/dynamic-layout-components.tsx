"use client";

import dynamic from "next/dynamic";

export const DynamicNavbar = dynamic(
  () => import("@/components/layout/navbar").then((mod) => mod.Navbar),
  { ssr: false }
);

export const DynamicFooter = dynamic(
  () => import("@/components/layout/footer").then((mod) => mod.Footer),
  { ssr: false }
);

export const DynamicDither = dynamic(
  () => import("@/components/bits/dither").then((mod) => mod.Dither),
  {
    ssr: true,
    loading: () => <div className="h-full w-full bg-muted" />,
  }
);

// Wrappers that contain content should typically NOT be ssr: false to preserve SEO and initial render
// However, we load them dynamically to reduce initial bundle size for the layout chunk
export const DynamicClickSpark = dynamic(
  () => import("@/components/bits/click-spark").then((mod) => mod.ClickSpark),
  { ssr: true }
);

export const DynamicSmoothScroll = dynamic(
  () =>
    import("@/components/effects/smooth-scroll").then(
      (mod) => mod.SmoothScroll
    ),
  { ssr: true }
);

export const DynamicAnimationSkipProvider = dynamic(
  () =>
    import("@/lib/contexts/animation-skip-context").then(
      (mod) => mod.AnimationSkipProvider
    ),
  { ssr: true }
);

// Development-only performance monitor
export const DynamicPerformanceMonitor = dynamic(
  () =>
    import("@/components/dev/performance-monitor").then(
      (mod) => mod.PerformanceMonitor
    ),
  { ssr: false }
);
