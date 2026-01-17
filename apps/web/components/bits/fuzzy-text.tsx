"use client";

import React, { useEffect, useRef } from "react";
import { useAnimationFrame } from "@/lib/hooks/use-animation-frame";

type FuzzyTextProps = {
  children: React.ReactNode;
  fontSize?: number | string;
  fontWeight?: string | number;
  fontFamily?: string;
  color?: string;
  enableHover?: boolean;
  baseIntensity?: number;
  hoverIntensity?: number;
  fuzzRange?: number;
  fps?: number;
  direction?: "horizontal" | "vertical" | "both";
  transitionDuration?: number;
  clickEffect?: boolean;
  glitchMode?: boolean;
  glitchInterval?: number;
  glitchDuration?: number;
  gradient?: string[] | null;
  letterSpacing?: number;
  className?: string;
};

type AnimationState = {
  isHovering: boolean;
  isClicking: boolean;
  isGlitching: boolean;
  currentIntensity: number;
  frameDuration: number;
};

type CanvasContext = {
  ctx: CanvasRenderingContext2D | null;
  offscreen: HTMLCanvasElement | null;
  offCtx: CanvasRenderingContext2D | null;
  offscreenWidth: number;
  tightHeight: number;
  interactiveLeft: number;
  interactiveRight: number;
  interactiveTop: number;
  interactiveBottom: number;
};

// Helpers
function measureTextWidth(offCtx: CanvasRenderingContext2D, text: string, letterSpacing: number): number {
  if (letterSpacing === 0) return offCtx.measureText(text).width;
  let total = 0;
  for (const char of text) total += offCtx.measureText(char).width + letterSpacing;
  return total - letterSpacing;
}

function updateIntensity(state: AnimationState, baseIntensity: number, hoverIntensity: number, transitionDuration: number): void {
  let newTargetIntensity = baseIntensity;
  if (state.isClicking || state.isGlitching) newTargetIntensity = 1;
  else if (state.isHovering) newTargetIntensity = hoverIntensity;
  if (transitionDuration > 0) {
    const step = 1 / (transitionDuration / state.frameDuration);
    if (state.currentIntensity < newTargetIntensity) state.currentIntensity = Math.min(state.currentIntensity + step, newTargetIntensity);
    else if (state.currentIntensity > newTargetIntensity) state.currentIntensity = Math.max(state.currentIntensity - step, newTargetIntensity);
  } else state.currentIntensity = newTargetIntensity;
}

function drawFuzzyFrame(ctx: CanvasRenderingContext2D, offscreen: HTMLCanvasElement, offscreenWidth: number, tightHeight: number, fuzzRange: number, direction: "horizontal" | "vertical" | "both", intensity: number): void {
  ctx.clearRect(-fuzzRange - 20, -fuzzRange - 10, offscreenWidth + 2 * (fuzzRange + 20), tightHeight + 2 * (fuzzRange + 10));
  for (let j = 0; j < tightHeight; j++) {
    let dx = (direction === "horizontal" || direction === "both") ? Math.floor(intensity * (Math.random() - 0.5) * fuzzRange) : 0;
    let dy = (direction === "vertical" || direction === "both") ? Math.floor(intensity * (Math.random() - 0.5) * fuzzRange * 0.5) : 0;
    ctx.drawImage(offscreen, 0, j, offscreenWidth, 1, dx, j + dy, offscreenWidth, 1);
  }
}

function getNumericFontSize(fontSize: number | string): number {
  if (typeof fontSize === "number") return fontSize;
  const temp = document.createElement("span");
  temp.style.fontSize = fontSize;
  document.body.appendChild(temp);
  const size = Number.parseFloat(window.getComputedStyle(temp).fontSize);
  document.body.removeChild(temp);
  return size;
}

async function loadFont(fontWeight: string | number, fontSizeStr: string, computedFontFamily: string): Promise<void> {
  try {
    await document.fonts.load(`${fontWeight} ${fontSizeStr} ${computedFontFamily}`);
  } catch {
    await document.fonts.ready;
  }
}

function setupOffscreenCanvas(
  offCtx: CanvasRenderingContext2D,
  text: string,
  fontWeight: string | number,
  fontSizeStr: string,
  computedFontFamily: string,
  color: string,
  gradient: string[] | null,
  letterSpacing: number,
  offscreenWidth: number,
  xOffset: number,
  numericFontSize: number
): { actualAscent: number; actualDescent: number; textBoundingWidth: number; tightHeight: number } {
  offCtx.font = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;
  offCtx.textBaseline = "alphabetic";

  const totalWidth = measureTextWidth(offCtx, text, letterSpacing);
  const metrics = offCtx.measureText(text);
  const actualLeft = metrics.actualBoundingBoxLeft ?? 0;
  const actualRight = letterSpacing !== 0 ? totalWidth : (metrics.actualBoundingBoxRight ?? metrics.width);
  const actualAscent = metrics.actualBoundingBoxAscent ?? numericFontSize;
  const actualDescent = metrics.actualBoundingBoxDescent ?? numericFontSize * 0.2;
  const textBoundingWidth = Math.ceil(letterSpacing !== 0 ? totalWidth : actualLeft + actualRight);
  const tightHeight = Math.ceil(actualAscent + actualDescent);

  if (gradient && Array.isArray(gradient) && gradient.length >= 2) {
    const grad = offCtx.createLinearGradient(0, 0, offscreenWidth, 0);
    gradient.forEach((c, i) => grad.addColorStop(i / (gradient.length - 1), c));
    offCtx.fillStyle = grad;
  } else {
    offCtx.fillStyle = color;
  }

  if (letterSpacing !== 0) {
    let xPos = xOffset;
    for (const char of text) {
      offCtx.fillText(char, xPos, actualAscent);
      xPos += offCtx.measureText(char).width + letterSpacing;
    }
  } else {
    offCtx.fillText(text, xOffset - actualLeft, actualAscent);
  }

  return { actualAscent, actualDescent, textBoundingWidth, tightHeight };
}

const FuzzyText: React.FC<FuzzyTextProps> = ({
  children,
  fontSize = "clamp(2rem, 8vw, 8rem)",
  fontWeight = 900,
  fontFamily = "inherit",
  color = "#fff",
  enableHover = true,
  baseIntensity = 0.18,
  hoverIntensity = 0.5,
  fuzzRange = 30,
  fps = 60,
  direction = "horizontal",
  transitionDuration = 0,
  clickEffect = false,
  glitchMode = false,
  glitchInterval = 2000,
  glitchDuration = 200,
  gradient = null,
  letterSpacing = 0,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement & { cleanupFuzzyText?: () => void }>(null);
  const animationStateRef = useRef<AnimationState>({
    isHovering: false,
    isClicking: false,
    isGlitching: false,
    currentIntensity: baseIntensity,
    frameDuration: 1000 / fps,
  });
  const canvasContextRef = useRef<CanvasContext>({
    ctx: null,
    offscreen: null,
    offCtx: null,
    offscreenWidth: 0,
    tightHeight: 0,
    interactiveLeft: 0,
    interactiveRight: 0,
    interactiveTop: 0,
    interactiveBottom: 0,
  });
  const animate = useRef<(() => void) | null>(null);

  useEffect(() => {
    let glitchTimeoutId: ReturnType<typeof setTimeout>;
    let glitchEndTimeoutId: ReturnType<typeof setTimeout>;
    let clickTimeoutId: ReturnType<typeof setTimeout>;
    let isMounted = true;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: canvas init orchestration is complex
    const init = async () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const computedFontFamily = fontFamily === "inherit" ? window.getComputedStyle(canvas).fontFamily || "sans-serif" : fontFamily;
      const fontSizeStr = typeof fontSize === "number" ? `${fontSize}px` : fontSize;
      await loadFont(fontWeight, fontSizeStr, computedFontFamily);
      if (!isMounted) return;

      const numericFontSize = getNumericFontSize(fontSize);
      const text = React.Children.toArray(children).join("");
      const offscreen = document.createElement("canvas");
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;

      const totalWidth = measureTextWidth(offCtx, text, letterSpacing);
      const metrics = offCtx.measureText(text);
      const actualLeft = metrics.actualBoundingBoxLeft ?? 0;
      const actualRight = letterSpacing !== 0 ? totalWidth : (metrics.actualBoundingBoxRight ?? metrics.width);
      const textBoundingWidth = Math.ceil(letterSpacing !== 0 ? totalWidth : actualLeft + actualRight);
      const extraWidthBuffer = 10;
      const offscreenWidth = textBoundingWidth + extraWidthBuffer;
      const xOffset = extraWidthBuffer / 2;

      offscreen.width = offscreenWidth;
      offscreen.height = 1;

      const { actualAscent, actualDescent, tightHeight } = setupOffscreenCanvas(
        offCtx, text, fontWeight, fontSizeStr, computedFontFamily, color, gradient, letterSpacing, offscreenWidth, xOffset, numericFontSize
      );

      const horizontalMargin = fuzzRange + 20;
      const verticalMargin = direction === "vertical" || direction === "both" ? fuzzRange + 10 : 0;
      canvas.width = offscreenWidth + horizontalMargin * 2;
      canvas.height = tightHeight + verticalMargin * 2;
      ctx.translate(horizontalMargin, verticalMargin);

      const interactiveLeft = horizontalMargin + xOffset;
      const interactiveTop = verticalMargin;
      const interactiveRight = interactiveLeft + textBoundingWidth;
      const interactiveBottom = interactiveTop + tightHeight;

      canvasContextRef.current = { ctx, offscreen, offCtx, offscreenWidth, tightHeight, interactiveLeft, interactiveRight, interactiveTop, interactiveBottom };
      animationStateRef.current = { isHovering: false, isClicking: false, isGlitching: false, currentIntensity: baseIntensity, frameDuration: 1000 / fps };

      const startGlitchLoop = () => {
        if (!glitchMode) return;
        glitchTimeoutId = setTimeout(() => {
          animationStateRef.current.isGlitching = true;
          glitchEndTimeoutId = setTimeout(() => {
            animationStateRef.current.isGlitching = false;
            startGlitchLoop();
          }, glitchDuration);
        }, glitchInterval);
      };
      if (glitchMode) startGlitchLoop();

      const bounds = { interactiveLeft, interactiveRight, interactiveTop, interactiveBottom };
      const isInsideTextArea = (x: number, y: number) => x >= bounds.interactiveLeft && x <= bounds.interactiveRight && y >= bounds.interactiveTop && y <= bounds.interactiveBottom;

      animate.current = () => {
        updateIntensity(animationStateRef.current, baseIntensity, hoverIntensity, transitionDuration);
        const { ctx: c, offscreen: o, offscreenWidth, tightHeight: h } = canvasContextRef.current;
        if (c && o) drawFuzzyFrame(c, o, offscreenWidth, h, fuzzRange, direction, animationStateRef.current.currentIntensity);
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!enableHover) return;
        const rect = canvas.getBoundingClientRect();
        animationStateRef.current.isHovering = isInsideTextArea(e.clientX - rect.left, e.clientY - rect.top);
      };
      const handleMouseLeave = () => { animationStateRef.current.isHovering = false; };
      const handleClick = () => {
        if (!clickEffect) return;
        animationStateRef.current.isClicking = true;
        clearTimeout(clickTimeoutId);
        clickTimeoutId = setTimeout(() => { animationStateRef.current.isClicking = false; }, 150);
      };
      const handleTouchMove = (e: TouchEvent) => {
        if (!enableHover) return;
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        animationStateRef.current.isHovering = isInsideTextArea(touch.clientX - rect.left, touch.clientY - rect.top);
      };
      const handleTouchEnd = () => { animationStateRef.current.isHovering = false; };

      if (enableHover) {
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseleave", handleMouseLeave);
        canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
        canvas.addEventListener("touchend", handleTouchEnd);
      }
      if (clickEffect) canvas.addEventListener("click", handleClick);

      const cleanup = () => {
        clearTimeout(glitchTimeoutId);
        clearTimeout(glitchEndTimeoutId);
        clearTimeout(clickTimeoutId);
        if (enableHover) {
          canvas.removeEventListener("mousemove", handleMouseMove);
          canvas.removeEventListener("mouseleave", handleMouseLeave);
          canvas.removeEventListener("touchmove", handleTouchMove);
          canvas.removeEventListener("touchend", handleTouchEnd);
        }
        if (clickEffect) canvas.removeEventListener("click", handleClick);
      };
      canvas.cleanupFuzzyText = cleanup;
    };

    init();

    return () => {
      isMounted = false;
      clearTimeout(glitchTimeoutId);
      clearTimeout(glitchEndTimeoutId);
      clearTimeout(clickTimeoutId);
      if (canvas?.cleanupFuzzyText) canvas.cleanupFuzzyText();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, fontSize, fontWeight, fontFamily, color, enableHover, baseIntensity, hoverIntensity, fuzzRange, fps, direction, transitionDuration, clickEffect, glitchMode, glitchInterval, glitchDuration, gradient, letterSpacing]);

  useAnimationFrame(() => { if (animate.current) animate.current(); }, { fps });

  return <canvas className={className} ref={canvasRef} />;
};

export default FuzzyText;
