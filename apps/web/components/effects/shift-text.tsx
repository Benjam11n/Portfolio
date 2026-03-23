"use client";

import { useGSAP } from "@gsap/react";
import gsapCore from "gsap";
import type React from "react";
import { createElement, useMemo } from "react";

import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

interface ShiftTextProps {
  children: string;
  className?: string;
  as?: React.ElementType;
}

const createCharacterKeys = (text: string, prefix: string) => {
  const counts = new Map<string, number>();

  return [...text].map((char) => {
    const nextCount = (counts.get(char) ?? 0) + 1;
    counts.set(char, nextCount);

    return {
      char,
      key: `${prefix}-${char}-${nextCount}`,
    };
  });
};

export const ShiftText = ({
  children,
  className,
  as: Component = "span",
}: ShiftTextProps) => {
  const primaryChars = useMemo(
    () => createCharacterKeys(children, "primary"),
    [children]
  );
  const secondaryChars = useMemo(
    () => createCharacterKeys(children, "secondary"),
    [children]
  );
  const componentProps = {
    children: (
      <>
        {/* Primary Text (Visible initially) */}
        <span aria-hidden="true" className="block">
          {primaryChars.map(({ char, key }) => (
            <span
              className="shift-char-primary inline-block whitespace-pre-wrap"
              key={key}
            >
              {char}
            </span>
          ))}
        </span>

        {/* Secondary Text (Hidden below initially) */}
        <span
          aria-hidden="true"
          className="absolute top-0 left-0 block h-full w-full translate-y-[120%]"
        >
          {secondaryChars.map(({ char, key }) => (
            <span
              className="shift-char-secondary inline-block whitespace-pre-wrap"
              key={key}
            >
              {char}
            </span>
          ))}
        </span>

        {/* Screen reader only text */}
        <span className="sr-only">{children}</span>
      </>
    ),
    className: cn("relative inline-block overflow-hidden align-top", className),
  } as React.HTMLAttributes<HTMLElement> & {
    children: React.ReactNode;
  };

  return createElement(Component, componentProps);
};

export const useShiftAnimation = (
  scope: React.RefObject<HTMLElement | null>
) => {
  const { contextSafe } = useGSAP({ scope });
  const prefersReducedMotion = usePrefersReducedMotion();

  const animateIn = contextSafe(() => {
    if (prefersReducedMotion) {
      // Instant state change when reduced motion is preferred
      // Both primary and secondary move to -120% to swap visible text
      gsapCore.set(".shift-char-primary", {
        y: "-120%",
      });
      gsapCore.set(".shift-char-secondary", {
        y: "-120%",
      });
    } else {
      // Animated transition with stagger for smooth visual effect
      gsapCore.to(".shift-char-primary", {
        duration: 0.2,
        ease: "power2.inOut",
        stagger: 0.01,
        y: "-120%",
      });
      gsapCore.to(".shift-char-secondary", {
        duration: 0.2,
        ease: "power2.inOut",
        stagger: 0.01,
        y: "-120%",
      });
    }
  });

  const animateOut = contextSafe(() => {
    if (prefersReducedMotion) {
      // Instant state change when reduced motion is preferred
      gsapCore.set(".shift-char-primary", {
        y: "0%",
      });
      gsapCore.set(".shift-char-secondary", {
        y: "120%",
      });
    } else {
      // Animated transition with stagger
      gsapCore.to(".shift-char-primary", {
        duration: 0.2,
        ease: "power2.inOut",
        stagger: 0.01,
        y: "0%",
      });
      gsapCore.to(".shift-char-secondary", {
        duration: 0.2,
        ease: "power2.inOut",
        stagger: 0.01,
        y: "120%",
      });
    }
  });

  return { animateIn, animateOut };
};
