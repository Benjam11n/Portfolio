import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

const progressVariants = cva(
  "h-full w-full flex-1 transition-all duration-300 ease-in-out",
  {
    defaultVariants: {
      variant: "primary",
    },
    variants: {
      variant: {
        destructive: "bg-destructive",
        primary: "bg-primary",
        success: "bg-green-600",
        warning: "bg-yellow-600",
      },
    },
  }
);

export type ProgressProps = React.ComponentProps<"div"> &
  VariantProps<typeof progressVariants> & {
    value?: number;
    max?: number;
    fillClassName?: string;
  };

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    { className, value = 0, max = 100, variant, fillClassName, ...props },
    ref
  ) => {
    /*
     * Fix for progress bar starting full:
     * Ensure safe value parsing and clamp between 0-100.
     * If value is 0, explicit 0% transform.
     */
    const safeValue = typeof value === "number" ? Math.max(0, value) : 0;
    const safeMax = typeof max === "number" && max > 0 ? max : 100;
    const percentage = Math.min((safeValue / safeMax) * 100, 100);

    return (
      <div
        aria-valuemax={max}
        aria-valuemin={0}
        aria-valuenow={value}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
          className
        )}
        ref={ref}
        role="progressbar"
        {...props}
      >
        <div
          className={cn(
            progressVariants({ className: fillClassName, variant })
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress, progressVariants };
