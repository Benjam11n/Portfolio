"use client";

import { useRef } from "react";
import type { ReactNode } from "react";

import { useClickSparkAnimation } from "@/components/bits/click-spark/hooks";
import type { ClickSparkEasing } from "@/components/bits/click-spark/types";
import { useElementVisibility } from "@/lib/hooks/ui/use-element-visibility";
import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";
import { useCanvasResize } from "@/lib/hooks/utils/use-canvas-resize";
import { cn } from "@/lib/utils";

export interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: ClickSparkEasing;
  extraScale?: number;
  children?: ReactNode;
  className?: string;
  listenOnDocument?: boolean;
}

export const ClickSpark = ({
  sparkColor = "#fff",
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = "ease-out",
  extraScale = 1,
  children,
  className,
  listenOnDocument = false,
}: ClickSparkProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isVisibleInViewport = useElementVisibility(containerRef);
  const canAnimate =
    (listenOnDocument || isVisibleInViewport) && !prefersReducedMotion;

  useCanvasResize(canvasRef, 100);

  useClickSparkAnimation({
    canAnimate,
    canvasRef,
    containerRef,
    duration,
    easing,
    extraScale,
    listenOnDocument,
    sparkColor,
    sparkCount,
    sparkRadius,
    sparkSize,
  });

  return (
    <div
      className={cn(
        listenOnDocument
          ? "pointer-events-none fixed inset-0"
          : "relative h-full w-full",
        className
      )}
      ref={containerRef}
    >
      <canvas
        className="pointer-events-none absolute inset-0 overflow-hidden"
        ref={canvasRef}
      />
      {children}
    </div>
  );
};
