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
