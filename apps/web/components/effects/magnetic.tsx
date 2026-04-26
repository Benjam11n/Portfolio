"use client";

import { useGSAP } from "@gsap/react";
import gsapCore from "gsap";
import { useRef } from "react";
import type { ReactElement } from "react";

import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";
import { useMobileDetection } from "@/lib/hooks/utils/use-mobile-detection";

interface MagneticProps {
  children: ReactElement;
  strength?: number;
}

export const Magnetic = ({ children, strength = 0.35 }: MagneticProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useMobileDetection();
  const shouldDisable = prefersReducedMotion || isMobile;

  const gsapContext = useGSAP({ scope: ref });
  const contextSafe =
    gsapContext?.contextSafe ?? ((fn: (...args: never[]) => void) => fn);

  const moveX = useRef<((value: number) => void) | null>(null);
  const moveY = useRef<((value: number) => void) | null>(null);

  useGSAP(
    () => {
      // If user prefers reduced motion, don't enable magnetic pull effect
      // This respects accessibility preferences and avoids motion sickness
      if (shouldDisable) {
        return;
      }

      moveX.current = gsapCore.quickTo(ref.current, "x", {
        duration: 1,
        ease: "elastic.out(1, 0.3)",
      });
      moveY.current = gsapCore.quickTo(ref.current, "y", {
        duration: 1,
        ease: "elastic.out(1, 0.3)",
      });
    },
    { scope: ref }
  );

  const handleMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } =
      ref.current?.getBoundingClientRect() || {
        height: 0,
        left: 0,
        top: 0,
        width: 0,
      };

    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);

    moveX.current?.(middleX * strength);
    moveY.current?.(middleY * strength);
  });

  const handleMouseLeave = contextSafe(() => {
    moveX.current?.(0);
    moveY.current?.(0);
  });

  if (shouldDisable) {
    return children;
  }

  return (
    <div
      className="pointer-events-none inline-block"
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={ref}
    >
      <div className="pointer-events-auto">{children}</div>
    </div>
  );
};
