"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { RefObject } from "react";

/**
 * Options for character reveal animations.
 */
type CharacterRevealOptions = {
  /** Initial Y offset for characters (in pixels) */
  y?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Stagger delay between each character */
  stagger?: number;
  /** GSAP easing function */
  ease?: string;
  /** Initial opacity */
  autoAlpha?: number;
};

/**
 * Custom hook for character-by-character reveal animations using GSAP.
 *
 * This hook provides animation functions to reveal and hide text characters
 * with a smooth staggered animation. It's designed to work with the
 * CharacterReveal component and respects the GSAP context for proper cleanup.
 *
 * @param scope - React ref object for the container element
 * @param options - Animation configuration options
 * @returns Object containing animateIn and animateOut functions
 *
 * @example
 * ```tsx
 * const scopeRef = useRef(null);
 * const { animateIn, animateOut } = useCharacterReveal(scopeRef, {
 *   duration: 0.5,
 *   stagger: 0.03,
 * });
 *
 * // Trigger animation
 * animateIn();
 * ```
 */
export const useCharacterReveal = (
  scope: RefObject<HTMLElement | null>,
  options: CharacterRevealOptions = {}
) => {
  const {
    y = 50,
    duration = 0.5,
    stagger = 0.03,
    ease = "power3.out",
    autoAlpha = 0,
  } = options;

  const { contextSafe } = useGSAP({ scope });

  /**
   * Animates characters into view with a staggered reveal effect.
   * Characters should have the class "char-reveal" for this to work.
   */
  const animateIn = contextSafe(() => {
    gsap.to(".char-reveal", {
      y: 0,
      autoAlpha: 1,
      duration,
      stagger,
      ease,
    });
  });

  /**
   * Animates characters out of view, hiding them below.
   * Useful for reset or exit animations.
   */
  const animateOut = contextSafe(() => {
    gsap.to(".char-reveal", {
      y,
      autoAlpha,
      duration,
      stagger,
      ease,
    });
  });

  /**
   * Sets the initial state of characters (hidden below with optional opacity).
   * Call this before the first animateIn to ensure proper starting position.
   */
  const setInitialState = contextSafe(() => {
    gsap.set(".char-reveal", {
      y,
      autoAlpha,
    });
  });

  return { animateIn, animateOut, setInitialState };
};
