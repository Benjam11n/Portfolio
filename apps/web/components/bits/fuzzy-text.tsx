"use client";

import React, { useEffect, useRef } from "react";
import {
  type FuzzyAnimationStateReturn,
  useFuzzyAnimationState,
} from "@/lib/hooks/animation/use-fuzzy-animation-state";

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

/**
 * Configuration options for fuzzy canvas initialization.
 */
type FuzzyCanvasOptions = {
  text: string;
  fontSize: number | string;
  fontWeight: string | number;
  fontFamily: string;
  color: string;
  fuzzRange: number;
  direction: "horizontal" | "vertical" | "both";
  fps: number;
  baseIntensity: number;
  hoverIntensity: number;
  transitionDuration: number;
  gradient: string[] | null;
  letterSpacing: number;
  enableHover: boolean;
  clickEffect: boolean;
  glitchMode: boolean;
  glitchInterval: number;
  glitchDuration: number;
};

/**
 * Draws a single fuzzy frame by applying random offsets to each row of the offscreen canvas.
 *
 * This function:
 * - Clears the canvas area
 * - Iterates through each row of the text
 * - Applies random horizontal/vertical offsets based on direction and intensity
 * - Draws each row from the offscreen canvas with the calculated offsets
 *
 * @param ctx - The main canvas rendering context
 * @param offscreen - The offscreen canvas containing the pre-rendered text
 * @param offscreenWidth - Width of the offscreen canvas
 * @param tightHeight - Height of the text bounding box
 * @param fuzzRange - Maximum pixel offset for the fuzzy effect
 * @param direction - Which directions to apply fuzziness (horizontal/vertical/both)
 * @param currentIntensity - Current animation intensity (0-1 range)
 */
function drawFuzzyFrame(
  ctx: CanvasRenderingContext2D,
  offscreen: HTMLCanvasElement,
  offscreenWidth: number,
  tightHeight: number,
  fuzzRange: number,
  direction: "horizontal" | "vertical" | "both",
  currentIntensity: number
): void {
  ctx.clearRect(
    -fuzzRange - 20,
    -fuzzRange - 10,
    offscreenWidth + 2 * (fuzzRange + 20),
    tightHeight + 2 * (fuzzRange + 10)
  );

  for (let j = 0; j < tightHeight; j++) {
    let dx = 0;
    let dy = 0;
    if (direction === "horizontal" || direction === "both") {
      dx = Math.floor(currentIntensity * (Math.random() - 0.5) * fuzzRange);
    }
    if (direction === "vertical" || direction === "both") {
      dy = Math.floor(
        currentIntensity * (Math.random() - 0.5) * fuzzRange * 0.5
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
}

/**
 * Initializes the fuzzy text canvas with all necessary setup.
 *
 * This function handles:
 * - Font loading and measurement
 * - Offscreen canvas creation for text rendering
 * - Main canvas sizing and positioning
 * - Animation state initialization
 * - Event handler attachment
 *
 * @param canvas - The canvas element to initialize
 * @param ctx - The 2D rendering context
 * @param options - Configuration options for the fuzzy effect
 * @returns Object containing cleanup function and cancellation state
 */
async function initFuzzyCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  options: FuzzyCanvasOptions,
  animationState: FuzzyAnimationStateReturn,
  isCancelled: { current: boolean }
): Promise<void> {
  const {
    text,
    fontSize,
    fontWeight,
    fontFamily,
    color,
    fuzzRange,
    direction,
    fps,
    gradient,
    letterSpacing,
  } = options;

  const computedFontFamily =
    fontFamily === "inherit"
      ? window.getComputedStyle(canvas).fontFamily || "sans-serif"
      : fontFamily;
  const fontSizeStr = typeof fontSize === "number" ? `${fontSize}px` : fontSize;
  const fontString = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;

  const loadFont = async () => {
    try {
      await document.fonts.load(fontString);
    } catch {
      await document.fonts.ready;
    }
  };

  await loadFont();
  if (isCancelled.current || !canvas.isConnected) {
    return;
  }

  const getNumericFontSize = (): number => {
    if (typeof fontSize === "number") {
      return fontSize;
    }
    // Check if we're still in a valid DOM context
    if (!document.body) {
      return 16; // fallback font size
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
    letterSpacing === 0
      ? (metrics.actualBoundingBoxRight ?? metrics.width)
      : totalWidth;
  const actualAscent = metrics.actualBoundingBoxAscent ?? numericFontSize;
  const actualDescent =
    metrics.actualBoundingBoxDescent ?? numericFontSize * 0.2;

  const textBoundingWidth = Math.ceil(
    letterSpacing === 0 ? actualLeft + actualRight : totalWidth
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

    if (letterSpacing === 0) {
      offCtx.fillText(text, xOffset - actualLeft, actualAscent);
    } else {
      let xPos = xOffset;
      for (const char of text) {
        offCtx.fillText(char, xPos, actualAscent);
        xPos += offCtx.measureText(char).width + letterSpacing;
      }
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

  const frameDuration = 1000 / fps;

  const drawFrame = () => {
    drawFuzzyFrame(
      ctx,
      offscreen,
      offscreenWidth,
      tightHeight,
      fuzzRange,
      direction,
      animationState.currentIntensity.current
    );
  };

  let lastFrameTime = 0;

  const run = (timestamp: number) => {
    if (isCancelled.current) {
      return;
    }

    if (timestamp - lastFrameTime < frameDuration) {
      // Only schedule next frame if not cancelled
      if (!isCancelled.current) {
        window.requestAnimationFrame(run);
      }
      return;
    }
    lastFrameTime = timestamp;

    animationState.updateIntensity();
    drawFrame();

    // Only schedule next frame if not cancelled
    if (!isCancelled.current) {
      window.requestAnimationFrame(run);
    }
  };

  window.requestAnimationFrame(run);

  const isInsideTextArea = (x: number, y: number) =>
    x >= interactiveLeft &&
    x <= interactiveRight &&
    y >= interactiveTop &&
    y <= interactiveBottom;

  // Set up event listeners using the hook
  animationState.setupEventListeners(canvas, isInsideTextArea);

  // Create a cleanup function attached to the canvas or managed externally.
  // Ideally, initFuzzyCanvas just starts things. Cleanup is handled by the caller via refs.
  // To keep compatibility with the caller's expectation of cleanup if needed for the loop:
  // We can attach the loop cancellation to the isCancelled ref logic.
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isCancelledRef = useRef({ current: false });

  // Use the animation state hook at the top level
  const animationState = useFuzzyAnimationState({
    baseIntensity,
    hoverIntensity,
    transitionDuration,
    frameDuration: 1000 / fps,
    enableHover,
    clickEffect,
    glitchMode,
    glitchInterval,
    glitchDuration,
    isCancelled: isCancelledRef.current,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const text = React.Children.toArray(children).join("");
    const options: FuzzyCanvasOptions = {
      text,
      fontSize,
      fontWeight,
      fontFamily,
      color,
      fuzzRange,
      direction,
      fps,
      baseIntensity,
      hoverIntensity,
      transitionDuration,
      gradient,
      letterSpacing,
      enableHover,
      clickEffect,
      glitchMode,
      glitchInterval,
      glitchDuration,
    };

    // Reset cancellation state for the new effect cycle
    isCancelledRef.current.current = false;

    initFuzzyCanvas(
      canvas,
      ctx,
      options,
      animationState,
      isCancelledRef.current
    );

    return () => {
      isCancelledRef.current.current = true;
      animationState.removeEventListeners(canvas);
      animationState.cleanup();
    };
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
    animationState, // Dependency on animationState
  ]);

  return <canvas className={className} ref={canvasRef} />;
};

export default FuzzyText;
