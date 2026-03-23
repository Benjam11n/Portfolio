"use client";

import { useRef } from "react";
import type { ComponentProps } from "react";

import { ShiftText, useShiftAnimation } from "@/components/effects/shift-text";
import { cn } from "@/lib/utils";

type ShiftSubmitButtonProps = ComponentProps<"button"> & {
  children: string;
  className?: string;
  isLoading?: boolean;
};

export const ShiftSubmitButton = ({
  children,
  className,
  isLoading,
  type = "submit",
  ...props
}: ShiftSubmitButtonProps) => {
  const containerRef = useRef<HTMLButtonElement>(null);
  const { animateIn, animateOut } = useShiftAnimation(containerRef);
  const sharedProps = {
    ...props,
    className: cn(
      "relative inline-flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50",
      className
    ),
    disabled: isLoading || props.disabled,
    onMouseEnter: animateIn,
    onMouseLeave: animateOut,
    ref: containerRef,
  };

  const content = <ShiftText>{isLoading ? "Sending..." : children}</ShiftText>;

  if (type === "button") {
    return (
      <button {...sharedProps} type="button">
        {content}
      </button>
    );
  }

  if (type === "reset") {
    return (
      <button {...sharedProps} type="reset">
        {content}
      </button>
    );
  }

  return (
    <button {...sharedProps} type="submit">
      {content}
    </button>
  );
};
