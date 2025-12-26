"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useRef } from "react";

export function Magnetic({
  children,
  strength = 0.35, // Increased strength slightly for better feel
}: {
  children: React.ReactElement; // Enforce single element to clone
  strength?: number;
}) {
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

  return React.cloneElement(children, {
    ref,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  });
}
