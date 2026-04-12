"use client";

import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useAnimationFrame } from "@/lib/hooks/animation/use-animation-frame";
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
  easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out";
  extraScale?: number;
  children?: React.ReactNode;
  className?: string;
  listenOnDocument?: boolean;
}

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
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
  const sparksRef = useRef<Spark[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isVisibleInViewport = useElementVisibility(containerRef);
  const isVisible = listenOnDocument || isVisibleInViewport;
  const [hasActiveSparks, setHasActiveSparks] = useState(false);

  useCanvasResize(canvasRef, 100);

  const easeFunc = useCallback(
    (t: number) => {
      switch (easing) {
        case "linear": {
          return t;
        }
        case "ease-in": {
          return t * t;
        }
        case "ease-in-out": {
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        }
        default: {
          return t * (2 - t);
        }
      }
    },
    [easing]
  );

  const draw = useCallback(
    (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const nextSparks = sparksRef.current.filter((spark: Spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) {
          return false;
        }

        const progress = elapsed / duration;
        const eased = easeFunc(progress);

        const distance = eased * sparkRadius * extraScale;
        const lineLength = sparkSize * (1 - eased);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        return true;
      });

      sparksRef.current = nextSparks;

      if (nextSparks.length === 0) {
        setHasActiveSparks(false);
      }
    },
    [sparkColor, sparkSize, sparkRadius, duration, easeFunc, extraScale]
  );

  useAnimationFrame(draw, {
    enabled: isVisible && !prefersReducedMotion && hasActiveSparks,
    respectReducedMotion: false,
  });

  const handleClick = useCallback(
    (e: globalThis.MouseEvent) => {
      // Skip spark animation if user prefers reduced motion
      if (prefersReducedMotion) {
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const now = performance.now();
      const newSparks: Spark[] = Array.from({ length: sparkCount }, (_, i) => ({
        angle: (2 * Math.PI * i) / sparkCount,
        startTime: now,
        x,
        y,
      }));

      sparksRef.current.push(...newSparks);
      setHasActiveSparks(true);
    },
    [sparkCount, prefersReducedMotion]
  );

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
  }, [handleClick, listenOnDocument]);

  return (
    <div
      className={cn(
        listenOnDocument ? "fixed inset-0" : "relative h-full w-full",
        className
      )}
      ref={containerRef}
    >
      {/*
        This canvas is purely decorative for click feedback.
        It has pointer-events-none so it's non-interactive and doesn't affect accessibility.
      */}
      <canvas
        className="pointer-events-none absolute inset-0 overflow-hidden"
        ref={canvasRef}
      />
      {children}
    </div>
  );
};
