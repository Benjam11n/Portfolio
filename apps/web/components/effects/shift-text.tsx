"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type React from "react";
import { useMemo } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

type ShiftTextProps = {
  children: string;
  className?: string;
  as?: React.ElementType;
};

export const ShiftText = ({
  children,
  className,
  as: Component = "span",
}: ShiftTextProps) => {
  const chars = useMemo(() => children.split(""), [children]);
  // biome-ignore lint/suspicious/noExplicitAny: Polymorphic component handling
  const Comp = Component as any;

  return (
    <Comp
      className={cn(
        "relative inline-block overflow-hidden align-top",
        className
      )}
    >
      {/* Primary Text (Visible initially) */}
      <span aria-hidden="true" className="block">
        {chars.map((char, i) => (
          <span
            className="shift-char-primary inline-block whitespace-pre-wrap"
            // biome-ignore lint/suspicious/noArrayIndexKey: Characters are static and order is guaranteed
            key={`primary-${char}-${i}`}
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
        {chars.map((char, i) => (
          <span
            className="shift-char-secondary inline-block whitespace-pre-wrap"
            // biome-ignore lint/suspicious/noArrayIndexKey: Characters are static and order is guaranteed
            key={`secondary-${char}-${i}`}
          >
            {char}
          </span>
        ))}
      </span>

      {/* Screen reader only text */}
      <span className="sr-only">{children}</span>
    </Comp>
  );
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
      gsap.set(".shift-char-primary", {
        y: "-120%",
      });
      gsap.set(".shift-char-secondary", {
        y: "-120%",
      });
    } else {
      // Animated transition with stagger for smooth visual effect
      gsap.to(".shift-char-primary", {
        y: "-120%",
        duration: 0.2,
        stagger: 0.01,
        ease: "power2.inOut",
      });
      gsap.to(".shift-char-secondary", {
        y: "-120%",
        duration: 0.2,
        stagger: 0.01,
        ease: "power2.inOut",
      });
    }
  });

  const animateOut = contextSafe(() => {
    if (prefersReducedMotion) {
      // Instant state change when reduced motion is preferred
      gsap.set(".shift-char-primary", {
        y: "0%",
      });
      gsap.set(".shift-char-secondary", {
        y: "120%",
      });
    } else {
      // Animated transition with stagger
      gsap.to(".shift-char-primary", {
        y: "0%",
        duration: 0.2,
        stagger: 0.01,
        ease: "power2.inOut",
      });
      gsap.to(".shift-char-secondary", {
        y: "120%",
        duration: 0.2,
        stagger: 0.01,
        ease: "power2.inOut",
      });
    }
  });

  return { animateIn, animateOut };
};
