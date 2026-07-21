"use client";

import { useVisualPerformanceTier } from "@/lib/hooks/performance/use-visual-performance-tier";

export const useShouldReduceMotion = () => useVisualPerformanceTier() === "low";
