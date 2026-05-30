import type { RefObject } from "react";

export interface CardSettings {
  glare: boolean;
  glareIntensity: number;
  parallaxIntensity: number;
  rotationIntensity: number;
  thickness: number;
}

export interface CardRefs {
  cardRef: RefObject<HTMLDivElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  glareRef: RefObject<HTMLDivElement | null>;
}

export interface PointerState {
  normalizedX: number;
  normalizedY: number;
  rotateX: number;
  rotateY: number;
}

export interface Card3DHandlersOptions {
  refs: CardRefs;
  settings: CardSettings;
  shouldDisable3D: boolean;
}

export interface ParallaxAnimationOptions {
  content: HTMLDivElement | null;
  height: number;
  intensity: number;
  normalizedX: number;
  normalizedY: number;
  width: number;
}

export interface GlareAnimationOptions {
  glare: HTMLDivElement | null;
  glareEnabled: boolean;
  glareIntensity: number;
  height: number;
  normalizedX: number;
  normalizedY: number;
  width: number;
}

export type Card3DVariant =
  | "book"
  | "compact"
  | "dramatic"
  | "media"
  | "skill"
  | "standard"
  | "subtle"
  | "text";
