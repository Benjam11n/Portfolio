"use client";

import { useCallback, useEffect, useEffectEvent, useRef } from "react";
import type { RefObject } from "react";

import type {
  ClickSparkEasing,
  Spark,
} from "@/components/bits/click-spark/types";
import {
  createSparks,
  drawSparks,
  getCanvasClickPoint,
  getCanvasContext,
} from "@/components/bits/click-spark/utils";

interface ClickSparkAnimationOptions {
  canAnimate: boolean;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  duration: number;
  easing: ClickSparkEasing;
  extraScale: number;
  listenOnDocument: boolean;
  sparkColor: string;
  sparkCount: number;
  sparkRadius: number;
  sparkSize: number;
}

export const useClickSparkAnimation = ({
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
}: ClickSparkAnimationOptions) => {
  const frameIdRef = useRef<number | null>(null);
  const sparksRef = useRef<Spark[]>([]);

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
      canvasRef,
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
  }, [containerRef, listenOnDocument]);

  useEffect(() => stopAnimation, [stopAnimation]);
};
