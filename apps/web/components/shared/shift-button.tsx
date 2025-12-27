import type Link from "next/link";
import { type ComponentProps, type ReactNode, useRef } from "react";
import { ShiftText, useShiftAnimation } from "@/components/effects/shift-text";
import { ScrollLink } from "@/components/shared/scroll-link";
import { cn } from "@/lib/utils";

interface ShiftButtonProps extends ComponentProps<typeof Link> {
  children: string;
  icon?: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export const ShiftButton = ({
  children,
  className,
  icon,
  variant = "primary",
  ...props
}: ShiftButtonProps) => {
  const containerRef = useRef<HTMLAnchorElement>(null);
  const { animateIn, animateOut } = useShiftAnimation(containerRef);

  const baseStyles =
    "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-4 py-2 font-bold text-sm transition-transform hover:scale-105";
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary:
      "bg-secondary text-secondary-foreground shadow-sm hover:bg-accent hover:text-accent-foreground",
  };

  return (
    <ScrollLink
      className={cn(baseStyles, variants[variant], className)}
      onMouseEnter={animateIn}
      onMouseLeave={animateOut}
      ref={containerRef}
      {...props}
    >
      {icon}
      <ShiftText>{children}</ShiftText>
    </ScrollLink>
  );
};
