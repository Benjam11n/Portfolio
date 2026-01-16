"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Configuration options for scroll reveal animations.
 * Controls animation behavior including position, scale, timing, and scroll trigger settings.
 */
export type ScrollRevealOptions = {
  /** Vertical offset to animate from (in pixels). Default: 30 */
  y?: number;
  /** Horizontal offset to animate from (in pixels). Default: 0 */
  x?: number;
  /** Scale factor to animate from. Default: 1 */
  scale?: number;
  /** Animation duration in seconds. Default: 0.8 */
  duration?: number;
  /** Delay before animation starts (in seconds). Default: 0 */
  delay?: number;
  /** Stagger delay between multiple elements (in seconds). Default: 0.1 */
  stagger?: number;
  /** GSAP easing function. Default: "power3.out" */
  ease?: string;
  /** Scroll trigger start position. Default: "top 85%" */
  start?: string;
  /** Scroll trigger toggle actions. Default: "play none none none" */
  toggleActions?: string;
};

/**
 * Type alias for scroll reveal preset configuration options.
 * Can be used to create custom presets that match the expected structure.
 */
export type ScrollRevealPreset = ScrollRevealOptions;

/**
 * Predefined animation presets for common scroll reveal effects.
 * Each preset is optimized for specific use cases and can be overridden with custom options.
 *
 * @example
 * ```tsx
 * // Using a preset directly
 * useScrollReveal(ref, ".item", {}, "fadeIn");
 *
 * // Overriding preset values
 * useScrollReveal(ref, ".item", { duration: 1.2 }, "slideUp");
 * ```
 */
export const scrollRevealPresets = {
  /** Subtle fade-in animation with minimal movement. Best for text content and delicate elements. */
  fadeIn: {
    y: 0,
    x: 0,
    duration: 0.6,
    delay: 0,
    stagger: 0.05,
    ease: "power2.out",
    start: "top 85%",
    toggleActions: "play none none none",
  } satisfies ScrollRevealPreset,
  /** Classic slide-up animation with vertical movement. Ideal for cards, sections, and content blocks. */
  slideUp: {
    y: 30,
    x: 0,
    duration: 0.8,
    delay: 0,
    stagger: 0.1,
    ease: "power3.out",
    start: "top 85%",
    toggleActions: "play none none none",
  } satisfies ScrollRevealPreset,
  /** Scale-up animation with slight bounce effect. Great for images, icons, and interactive elements. */
  scaleUp: {
    y: 0,
    x: 0,
    scale: 0.95,
    duration: 0.6,
    delay: 0,
    stagger: 0.08,
    ease: "back.out(1.7)",
    start: "top 85%",
    toggleActions: "play none none none",
  } satisfies ScrollRevealPreset,
  /** Quick fade animation with subtle movement. Perfect for rapid sequences and tight layouts. */
  quickFade: {
    y: 10,
    x: 0,
    duration: 0.4,
    delay: 0,
    stagger: 0.03,
    ease: "power1.out",
    start: "top 85%",
    toggleActions: "play none none none",
  } satisfies ScrollRevealPreset,
} as const;

/**
 * Union type of all available preset names.
 * Use this type to ensure type safety when passing preset names.
 *
 * @example
 * ```tsx
 * const preset: ScrollRevealPresetName = "fadeIn"; // ✅ Valid
 * const invalid: ScrollRevealPresetName = "invalid"; // ❌ Type error
 * ```
 */
export type ScrollRevealPresetName = keyof typeof scrollRevealPresets;

/**
 * Custom hook for scroll-triggered reveal animations using GSAP and ScrollTrigger.
 *
 * Animates elements into view when the container enters the viewport. Supports both
 * custom options and predefined presets for common animation patterns.
 *
 * @param containerRef - Reference to the container element that triggers the animation
 * @param targetSelector - CSS selector(s) for elements to animate (single selector or array)
 * @param options - Optional configuration overrides (merged with preset if provided)
 * @param preset - Optional preset name to use predefined animation settings
 *
 * @example
 * ```tsx
 * // Basic usage with default options
 * const ref = useRef<HTMLDivElement>(null);
 * useScrollReveal(ref, ".animate-item");
 *
 * // Using a preset
 * useScrollReveal(ref, ".card", {}, "fadeIn");
 *
 * // Custom options
 * useScrollReveal(ref, ".item", { y: 50, duration: 1 });
 *
 * // Preset with overrides
 * useScrollReveal(ref, ".item", { stagger: 0.2 }, "slideUp");
 *
 * // Multiple selectors
 * useScrollReveal(ref, [".title", ".description"], {}, "quickFade");
 * ```
 */
export const useScrollReveal = (
  containerRef: RefObject<HTMLElement | null>,
  targetSelector: string | string[],
  options: ScrollRevealOptions = {},
  preset?: ScrollRevealPresetName
) => {
  // Merge preset with explicit options (options override preset values)
  const presetOptions = preset ? scrollRevealPresets[preset] : {};
  const mergedOptions = { ...presetOptions, ...options };

  const {
    y = 30,
    x = 0,
    duration = 0.8,
    delay = 0,
    stagger = 0.1,
    ease = "power3.out",
    start = "top 85%",
    toggleActions = "play none none none",
    scale,
  } = mergedOptions;

  useGSAP(
    () => {
      const targets = Array.isArray(targetSelector)
        ? targetSelector.join(", ")
        : targetSelector;

      gsap.set(targets, {
        y,
        x,
        scale,
        autoAlpha: 0,
      });

      gsap.to(targets, {
        scrollTrigger: {
          trigger: containerRef.current,
          start,
          toggleActions,
        },
        y: 0,
        x: 0,
        scale: 1,
        autoAlpha: 1,
        duration,
        delay,
        stagger,
        ease,
      });
    },
    {
      scope: containerRef,
      dependencies: [
        y,
        x,
        scale,
        duration,
        delay,
        stagger,
        ease,
        start,
        toggleActions,
        targetSelector,
      ],
    }
  );
};
