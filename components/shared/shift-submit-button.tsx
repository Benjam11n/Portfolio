"use client";

import { type ComponentProps, useRef } from "react";
import { ShiftText, useShiftAnimation } from "@/components/effects/shift-text";
import { cn } from "@/lib/utils";

interface ShiftSubmitButtonProps extends ComponentProps<"button"> {
  children: string;
  className?: string;
  isLoading?: boolean;
}

export const ShiftSubmitButton = ({
  children,
  className,
  isLoading,
  ...props
}: ShiftSubmitButtonProps) => {
  const containerRef = useRef<HTMLButtonElement>(null);
  const { animateIn, animateOut } = useShiftAnimation(containerRef);

  return (
    <button
      className={cn(
        "relative inline-flex w-full items-center justify-center overflow-hidden rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50",
        className
      )}
      disabled={isLoading || props.disabled}
      onMouseEnter={animateIn}
      onMouseLeave={animateOut}
      ref={containerRef}
      {...props}
    >
      <ShiftText>{isLoading ? "Sending..." : children}</ShiftText>
    </button>
  );
};
