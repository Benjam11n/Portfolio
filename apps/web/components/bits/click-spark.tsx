"use client";

import type React from "react";
import { useCallback, useEffect, useEffectEvent, useRef } from "react";

import { useElementVisibility } from "@/lib/hooks/ui/use-element-visibility";
import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";
import { useCanvasResize } from "@/lib/hooks/utils/use-canvas-resize";
import { cn } from "@/lib/utils";

import type { ClickSparkEasing, Spark } from "./click-spark-utils";
import {
  createSparks,
  drawSparks,
  getCanvasContext,
  getCanvasClickPoint,
} from "./click-spark-utils";

export interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: ClickSparkEasing;
  extraScale?: number;
  children?: React.ReactNode;
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
  const frameIdRef = useRef<number | null>(null);
  const sparksRef = useRef<Spark[]>([]);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isVisibleInViewport = useElementVisibility(containerRef);
  const canAnimate =
    (listenOnDocument || isVisibleInViewport) && !prefersReducedMotion;

  useCanvasResize(canvasRef, 100);

  const stopAnimation = useCallback(() => {
    if (frameIdRef.current !== null) {
      cancelAnimationFrame(frameIdRef.current);
      frameIdRef.current = null;
    }
  }, []);

  const draw = useCallback(
    function drawFrame(timestamp: number) {
      const context = getCanvasContext(canvasRef.current);

      if (!(context && canAnimate)) {
        stopAnimation();
        return;
      }

      const { canvas, ctx } = context;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparksRef.current = drawSparks({
        ctx,
        duration,
        easing,
        extraScale,
        sparkColor,
        sparkRadius,
        sparkSize,
        sparks: sparksRef.current,
        timestamp,
      });

      frameIdRef.current =
        sparksRef.current.length > 0 ? requestAnimationFrame(drawFrame) : null;
    },
    [
      canAnimate,
      duration,
      easing,
      extraScale,
      sparkColor,
      sparkRadius,
      sparkSize,
      stopAnimation,
    ]
  );

  const startAnimation = useCallback(() => {
    if (frameIdRef.current === null) {
      frameIdRef.current = requestAnimationFrame(draw);
    }
  }, [draw]);

  const handleClick = useEffectEvent((event: globalThis.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!(canvas && canAnimate)) {
      return;
    }

    const { x, y } = getCanvasClickPoint(event, canvas);
    sparksRef.current.push(
      ...createSparks(x, y, sparkCount, performance.now())
    );
    startAnimation();
  });

  useEffect(() => {
    const target = listenOnDocument ? document : containerRef.current;
    if (!target) {
      return;
    }

    const listener: EventListener = (event) => {
      if (event instanceof MouseEvent) {
        handleClick(event);
      }
    };

    target.addEventListener("click", listener);
    return () => {
      target.removeEventListener("click", listener);
    };
  }, [listenOnDocument]);

  useEffect(() => stopAnimation, [stopAnimation]);

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
