/**
 * Animation utility constants for consistent and performant animations.
 * These constants ensure animations stay within budget and provide a smooth user experience.
 */

/**
 * Maximum animation durations in milliseconds.
 * No animation should exceed 2 seconds unless user-initiated (per acceptance criteria).
 */
export const ANIMATION_DURATION = {
  /** Long transition duration (800ms) - use sparingly */
  LONG: 800,
  /** Maximum duration for non-user-initiated animations (2 seconds) */
  MAX: 2000,
  /** Medium-fast transition duration (500ms) */
  MEDIUM_FAST: 500,
  /** Medium-slow transition duration (700ms) */
  MEDIUM_SLOW: 700,
  /** Quick micro-interaction duration (300ms) */
  QUICK: 300,
  /** Short transition duration (350ms) */
  SHORT: 350,
  /** Standard transition duration (600ms) - most commonly used */
  STANDARD: 600,
} as const;

/**
 * GSAP easing functions for smooth animations.
 * These are the easing functions used throughout the application.
 */
export const ANIMATION_EASING = {
  /** Medium overshoot for moderate emphasis */
  BACK_MEDIUM: "back.out(1.5)",
  /** Strong overshoot for high emphasis */
  BACK_STRONG: "back.out(2)",
  /** Subtle overshoot for emphasis */
  BACK_SUBTLE: "back.out(1.2)",
  /** Default easing - smooth deceleration (most common) */
  DEFAULT: "power4.out",
  /** Elastic bounce effect for playful interactions */
  ELASTIC: "elastic.out(1, 0.75)",
  /** No easing - linear interpolation */
  NONE: "none",
  /** Slightly faster deceleration */
  POWER3: "power3.out",
} as const;

/**
 * Stagger timing for sequential animations (in seconds).
 * These values create natural rhythm when animating multiple elements.
 */
export const ANIMATION_STAGGER = {
  /** Quick stagger for rapid sequences */
  QUICK: 0.05,
  /** Slow stagger for deliberate sequences */
  SLOW: 0.15,
  /** Standard stagger for most sequences */
  STANDARD: 0.1,
  /** Very slow stagger for dramatic reveals */
  VERY_SLOW: 0.2,
} as const;
