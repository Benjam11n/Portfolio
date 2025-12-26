"use client";

import { type ComponentProps, useRef } from "react";
import { cn } from "@/lib/utils";
import { ShiftText, useShiftAnimation } from "./shift-text";

interface ShiftSubmitButtonProps extends ComponentProps<"button"> {
  children: string;
  className?: string;
}

export const ShiftSubmitButton = ({
  children,
  className,
  ...props
}: ShiftSubmitButtonProps) => {
  const containerRef = useRef<HTMLButtonElement>(null);
  const { animateIn, animateOut } = useShiftAnimation(containerRef);

  return (
    <button
      className={cn(
        "relative inline-flex w-full items-center justify-center overflow-hidden rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90",
        className
      )}
      onMouseEnter={animateIn}
      onMouseLeave={animateOut}
      ref={containerRef}
      {...props}
    >
      <ShiftText>{children}</ShiftText>
    </button>
  );
};
