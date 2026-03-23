"use client";

import { useGSAP } from "@gsap/react";
import gsapCore from "gsap";
import type React from "react";
import { createElement, useEffect, useMemo, useRef } from "react";

import { useCharacterReveal } from "@/lib/hooks/ui/use-character-reveal";
import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

interface CharacterRevealProps {
  children: string;
  className?: string;
  as?: React.ElementType;
  y?: number;
  duration?: number;
  stagger?: number;
  ease?: string;
  autoAlpha?: number;
  delay?: number;
}

/**
 * CharacterReveal component for animated character-by-character text reveals.
 *
 * This component splits text into individual characters and animates them with
 * a smooth staggered effect using GSAP. It includes full accessibility support
 * with screen reader text and respects prefers-reduced-motion preferences.
 *
 * @example
 * ```tsx
 * <CharacterReveal duration={0.6} stagger={0.03}>
 *   Hello World
 * </CharacterReveal>
 * ```
 */
export const CharacterReveal = ({
  children,
  className,
  as: Component = "span",
  y = 50,
  duration = 0.5,
  stagger = 0.03,
  ease = "power3.out",
  autoAlpha = 0,
  delay = 0,
}: CharacterRevealProps) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const chars = useMemo(
    () =>
      [...children].map((char, i) => ({
        char,
        id: `char-${char}-${i}`,
        isSpace: char === " ",
      })),
    [children]
  );
  const componentProps = {
    children: (
      <>
        {/* Animated Characters */}
        <span aria-hidden="true" className="inline-block">
          {chars.map(({ char, id, isSpace }) => (
            <span
              className={cn(
                "char-reveal inline-block whitespace-pre",
                isSpace && "w-[0.25em]"
              )}
              key={id}
            >
              {char}
            </span>
          ))}
        </span>

        {/* Screen reader only text */}
        <span className="sr-only">{children}</span>
      </>
    ),
    className: cn("relative inline-block", className),
    ref: containerRef,
  } as React.HTMLAttributes<HTMLElement> & {
    children: React.ReactNode;
    ref: React.RefObject<HTMLSpanElement | null>;
  };

  const { setInitialState, animateIn } = useCharacterReveal(containerRef, {
    autoAlpha,
    duration,
    ease,
    stagger,
    y,
  });

  useGSAP(() => {
    if (prefersReducedMotion) {
      // Skip animation for users who prefer reduced motion
      gsapCore.set(".char-reveal", { autoAlpha: 1, y: 0 });
      return;
    }

    // Set initial state and trigger animation
    setInitialState();
  }, [prefersReducedMotion, setInitialState]);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timer = setTimeout(() => {
      animateIn();
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [prefersReducedMotion, animateIn, delay]);

  return createElement(Component, componentProps);
};
