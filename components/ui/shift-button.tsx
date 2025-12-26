"use client";

import Link from "next/link";
import { type ComponentProps, useRef } from "react";
import { cn } from "@/lib/utils";
import { ShiftText, useShiftAnimation } from "./shift-text";

interface ShiftButtonProps extends ComponentProps<typeof Link> {
  children: string; // Enforce string for ShiftText
  variant?: "primary" | "secondary";
  className?: string;
}

export const ShiftButton = ({
  children,
  className,
  variant = "primary",
  ...props
}: ShiftButtonProps) => {
  const containerRef = useRef<HTMLAnchorElement>(null);
  const { animateIn, animateOut } = useShiftAnimation(containerRef);

  const baseStyles =
    "relative inline-flex items-center justify-center overflow-hidden rounded-full px-4 py-2 font-bold text-sm transition-transform hover:scale-105";
  const variants = {
    primary: "bg-black text-white",
    secondary: "bg-white text-[#0F1419] shadow-sm hover:bg-gray-50",
  };

  return (
    <Link
      className={cn(baseStyles, variants[variant], className)}
      onMouseEnter={animateIn}
      onMouseLeave={animateOut}
      ref={containerRef}
      {...props}
    >
      <ShiftText>{children}</ShiftText>
    </Link>
  );
};
