/** biome-ignore-all lint/a11y/noNoninteractiveElementInteractions: Interaction is hover-only wrapper */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: Interaction is hover-only wrapper */
"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type ReactElement, useRef } from "react";

type MagneticProps = {
  children: ReactElement;
  strength?: number;
};

export function Magnetic({ children, strength = 0.35 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: ref });

  const moveX = useRef<((value: number) => void) | null>(null);
  const moveY = useRef<((value: number) => void) | null>(null);

  useGSAP(
    () => {
      moveX.current = gsap.quickTo(ref.current, "x", {
        duration: 1,
        ease: "elastic.out(1, 0.3)",
      });
      moveY.current = gsap.quickTo(ref.current, "y", {
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
        width: 0,
        left: 0,
        top: 0,
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

  return (
    <div
      className="inline-block"
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={ref}
    >
      {children}
    </div>
  );
}
