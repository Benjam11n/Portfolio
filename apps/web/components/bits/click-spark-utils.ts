export type ClickSparkEasing =
  | "linear"
  | "ease-in"
  | "ease-out"
  | "ease-in-out";

export interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
}

type EasingFunction = (progress: number) => number;

interface DrawSparksOptions {
  ctx: CanvasRenderingContext2D;
  duration: number;
  easing: ClickSparkEasing;
  extraScale: number;
  sparkColor: string;
  sparkRadius: number;
  sparks: Spark[];
  sparkSize: number;
  timestamp: number;
}

export const getCanvasContext = (canvas: HTMLCanvasElement | null) => {
  const ctx = canvas?.getContext("2d");

  return canvas && ctx ? { canvas, ctx } : null;
};

const EASING_FUNCTIONS = {
  "ease-in": (progress) => progress * progress,
  "ease-in-out": (progress) =>
    progress < 0.5
      ? 2 * progress * progress
      : -1 + (4 - 2 * progress) * progress,
  "ease-out": (progress) => progress * (2 - progress),
  linear: (progress) => progress,
} satisfies Record<ClickSparkEasing, EasingFunction>;

export const getSparkEase = (easing: ClickSparkEasing, progress: number) =>
  EASING_FUNCTIONS[easing](progress);

export const createSparks = (
  x: number,
  y: number,
  sparkCount: number,
  startTime: number
): Spark[] =>
  Array.from({ length: sparkCount }, (_, index) => ({
    angle: (2 * Math.PI * index) / sparkCount,
    startTime,
    x,
    y,
  }));

export const getCanvasClickPoint = (
  event: globalThis.MouseEvent,
  canvas: HTMLCanvasElement
) => {
  const rect = canvas.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
};

export const drawSparks = ({
  ctx,
  duration,
  easing,
  extraScale,
  sparkColor,
  sparkRadius,
  sparks,
  sparkSize,
  timestamp,
}: DrawSparksOptions) =>
  sparks.filter((spark) => {
    const elapsed = timestamp - spark.startTime;
    if (elapsed >= duration) {
      return false;
    }

    const eased = getSparkEase(easing, elapsed / duration);
    const distance = eased * sparkRadius * extraScale;
    const lineLength = sparkSize * (1 - eased);
    const startX = spark.x + distance * Math.cos(spark.angle);
    const startY = spark.y + distance * Math.sin(spark.angle);
    const endX = spark.x + (distance + lineLength) * Math.cos(spark.angle);
    const endY = spark.y + (distance + lineLength) * Math.sin(spark.angle);

    ctx.strokeStyle = sparkColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    return true;
  });
