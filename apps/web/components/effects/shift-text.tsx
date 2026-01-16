"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type React from "react";
import { useCallback, useMemo } from "react";
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

  const animateIn = useCallback(
    contextSafe(() => {
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
    }),
    [contextSafe]
  );

  const animateOut = useCallback(
    contextSafe(() => {
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
    }),
    [contextSafe]
  );

  return { animateIn, animateOut };
};
