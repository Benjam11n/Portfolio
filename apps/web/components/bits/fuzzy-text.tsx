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
  const canvasRef = useRef<
    HTMLCanvasElement & { cleanupFuzzyText?: () => void }
  >(null);

  // Refs to manage animation state accessible from useAnimationFrame callback
  const animationStateRef = useRef<{
    isHovering: boolean;
    isClicking: boolean;
    isGlitching: boolean;
    currentIntensity: number;
    frameDuration: number;
  }>({
    isHovering: false,
    isClicking: false,
    isGlitching: false,
    currentIntensity: baseIntensity,
    frameDuration: 1000 / fps,
  });

  // Refs for canvas drawing context and resources
  const canvasContextRef = useRef<{
    ctx: CanvasRenderingContext2D | null;
    offscreen: HTMLCanvasElement | null;
    offCtx: CanvasRenderingContext2D | null;
    offscreenWidth: number;
    tightHeight: number;
    interactiveLeft: number;
    interactiveRight: number;
    interactiveTop: number;
    interactiveBottom: number;
  }>({
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

  // Animation frame callback
  const animate = useRef<(() => void) | null>(null);

  useEffect(() => {
    let glitchTimeoutId: ReturnType<typeof setTimeout>;
    let glitchEndTimeoutId: ReturnType<typeof setTimeout>;
    let clickTimeoutId: ReturnType<typeof setTimeout>;
    let isMounted = true;
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: canvas init orchestration is complex
    const init = async () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      const computedFontFamily =
        fontFamily === "inherit"
          ? window.getComputedStyle(canvas).fontFamily || "sans-serif"
          : fontFamily;
      const fontSizeStr =
        typeof fontSize === "number" ? `${fontSize}px` : fontSize;
      const fontString = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;

      const loadFont = async () => {
        try {
          await document.fonts.load(fontString);
        } catch {
          await document.fonts.ready;
        }
      };

      await loadFont();
      if (!isMounted) {
        return;
      }

      const getNumericFontSize = () => {
        if (typeof fontSize === "number") {
          return fontSize;
        }
        const temp = document.createElement("span");
        temp.style.fontSize = fontSize;
        document.body.appendChild(temp);
        const computedSize = window.getComputedStyle(temp).fontSize;
        const size = Number.parseFloat(computedSize);
        document.body.removeChild(temp);
        return size;
      };

      const numericFontSize = getNumericFontSize();
      const text = React.Children.toArray(children).join("");

      // NOTE: Custom canvas sizing logic (not using useCanvasResize hook)
      // This component uses content-driven sizing (based on text metrics) rather than
      // parent-container-driven sizing. The canvas size is calculated once based on
      // text dimensions + custom margins for the fuzzy animation effect.
      // See: build-progress.txt Session 8 (subtask-3-1) for architectural rationale.
      const offscreen = document.createElement("canvas");
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) {
        return;
      }

      offCtx.font = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;
      offCtx.textBaseline = "alphabetic";

      const measureTextWidth = () => {
        if (letterSpacing === 0) {
          return offCtx.measureText(text).width;
        }
        let total = 0;
        for (const char of text) {
          total += offCtx.measureText(char).width + letterSpacing;
        }
        return total - letterSpacing;
      };

      const totalWidth = measureTextWidth();
      const metrics = offCtx.measureText(text);
      const actualLeft = metrics.actualBoundingBoxLeft ?? 0;
      const actualRight =
        letterSpacing !== 0
          ? totalWidth
          : (metrics.actualBoundingBoxRight ?? metrics.width);
      const actualAscent = metrics.actualBoundingBoxAscent ?? numericFontSize;
      const actualDescent =
        metrics.actualBoundingBoxDescent ?? numericFontSize * 0.2;

      const textBoundingWidth = Math.ceil(
        letterSpacing !== 0 ? totalWidth : actualLeft + actualRight
      );
      const tightHeight = Math.ceil(actualAscent + actualDescent);

      const extraWidthBuffer = 10;
      const offscreenWidth = textBoundingWidth + extraWidthBuffer;

      offscreen.width = offscreenWidth;
      offscreen.height = tightHeight;

      const xOffset = extraWidthBuffer / 2;

      const renderToOffscreen = () => {
        offCtx.font = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;
        offCtx.textBaseline = "alphabetic";

        if (gradient && Array.isArray(gradient) && gradient.length >= 2) {
          const grad = offCtx.createLinearGradient(0, 0, offscreenWidth, 0);
          gradient.forEach((c, i) => {
            grad.addColorStop(i / (gradient.length - 1), c);
          });
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
      };

      renderToOffscreen();

      const horizontalMargin = fuzzRange + 20;
      const verticalMargin =
        direction === "vertical" || direction === "both" ? fuzzRange + 10 : 0;
      canvas.width = offscreenWidth + horizontalMargin * 2;
      canvas.height = tightHeight + verticalMargin * 2;
      ctx.translate(horizontalMargin, verticalMargin);

      const interactiveLeft = horizontalMargin + xOffset;
      const interactiveTop = verticalMargin;
      const interactiveRight = interactiveLeft + textBoundingWidth;
      const interactiveBottom = interactiveTop + tightHeight;

      // Store canvas context in ref for animation callback access
      canvasContextRef.current = {
        ctx,
        offscreen,
        offCtx,
        offscreenWidth,
        tightHeight,
        interactiveLeft,
        interactiveRight,
        interactiveTop,
        interactiveBottom,
      };

      // Initialize animation state
      animationStateRef.current = {
        isHovering: false,
        isClicking: false,
        isGlitching: false,
        currentIntensity: baseIntensity,
        frameDuration: 1000 / fps,
      };

      const startGlitchLoop = () => {
        if (!glitchMode) {
          return;
        }
        glitchTimeoutId = setTimeout(() => {
          animationStateRef.current.isGlitching = true;
          glitchEndTimeoutId = setTimeout(() => {
            animationStateRef.current.isGlitching = false;
            startGlitchLoop();
          }, glitchDuration);
        }, glitchInterval);
      };

      if (glitchMode) {
        startGlitchLoop();
      }

      // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: animation logic is complex
      const updateIntensity = () => {
        const state = animationStateRef.current;
        let newTargetIntensity = baseIntensity;
        if (state.isClicking || state.isGlitching) {
          newTargetIntensity = 1;
        } else if (state.isHovering) {
          newTargetIntensity = hoverIntensity;
        }

        if (transitionDuration > 0) {
          const step = 1 / (transitionDuration / state.frameDuration);
          if (state.currentIntensity < newTargetIntensity) {
            state.currentIntensity = Math.min(
              state.currentIntensity + step,
              newTargetIntensity
            );
          } else if (state.currentIntensity > newTargetIntensity) {
            state.currentIntensity = Math.max(
              state.currentIntensity - step,
              newTargetIntensity
            );
          }
        } else {
          state.currentIntensity = newTargetIntensity;
        }
      };

      // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: animation logic is complex
      const drawFrame = () => {
        const { ctx, offscreen, offscreenWidth, tightHeight } =
          canvasContextRef.current;
        if (!(ctx && offscreen)) {
          return;
        }

        ctx.clearRect(
          -fuzzRange - 20,
          -fuzzRange - 10,
          offscreenWidth + 2 * (fuzzRange + 20),
          tightHeight + 2 * (fuzzRange + 10)
        );

        const intensity = animationStateRef.current.currentIntensity;

        for (let j = 0; j < tightHeight; j++) {
          let dx = 0;
          let dy = 0;
          if (direction === "horizontal" || direction === "both") {
            dx = Math.floor(intensity * (Math.random() - 0.5) * fuzzRange);
          }
          if (direction === "vertical" || direction === "both") {
            dy = Math.floor(
              intensity * (Math.random() - 0.5) * fuzzRange * 0.5
            );
          }
          ctx.drawImage(
            offscreen,
            0,
            j,
            offscreenWidth,
            1,
            dx,
            j + dy,
            offscreenWidth,
            1
          );
        }
      };

      // Set up animation callback
      animate.current = () => {
        updateIntensity();
        drawFrame();
      };

      const isInsideTextArea = (x: number, y: number) =>
        x >= interactiveLeft &&
        x <= interactiveRight &&
        y >= interactiveTop &&
        y <= interactiveBottom;

      const handleMouseMove = (e: MouseEvent) => {
        if (!enableHover) {
          return;
        }
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        animationStateRef.current.isHovering = isInsideTextArea(x, y);
      };

      const handleMouseLeave = () => {
        animationStateRef.current.isHovering = false;
      };

      const handleClick = () => {
        if (!clickEffect) {
          return;
        }
        animationStateRef.current.isClicking = true;
        clearTimeout(clickTimeoutId);
        clickTimeoutId = setTimeout(() => {
          animationStateRef.current.isClicking = false;
        }, 150);
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (!enableHover) {
          return;
        }
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        animationStateRef.current.isHovering = isInsideTextArea(x, y);
      };

      const handleTouchEnd = () => {
        animationStateRef.current.isHovering = false;
      };

      if (enableHover) {
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseleave", handleMouseLeave);
        canvas.addEventListener("touchmove", handleTouchMove, {
          passive: false,
        });
        canvas.addEventListener("touchend", handleTouchEnd);
      }

      if (clickEffect) {
        canvas.addEventListener("click", handleClick);
      }

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
        if (clickEffect) {
          canvas.removeEventListener("click", handleClick);
        }
      };

      canvas.cleanupFuzzyText = cleanup;
    };

    init();

    return () => {
      isMounted = false;
      clearTimeout(glitchTimeoutId);
      clearTimeout(glitchEndTimeoutId);
      clearTimeout(clickTimeoutId);
      if (canvas?.cleanupFuzzyText) {
        canvas.cleanupFuzzyText();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    children,
    fontSize,
    fontWeight,
    fontFamily,
    color,
    enableHover,
    baseIntensity,
    hoverIntensity,
    fuzzRange,
    fps,
    direction,
    transitionDuration,
    clickEffect,
    glitchMode,
    glitchInterval,
    glitchDuration,
    gradient,
    letterSpacing,
  ]);

  // Animation loop using useAnimationFrame hook
  useAnimationFrame(
    () => {
      if (animate.current) {
        animate.current();
      }
    },
    { fps }
  );

  return <canvas className={className} ref={canvasRef} />;
};

export default FuzzyText;
