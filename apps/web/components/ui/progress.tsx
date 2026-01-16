import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Progress = forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    value?: number;
    max?: number;
    fillClassName?: string;
  }
>(({ className, value = 0, max = 100, fillClassName, ...props }, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

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
          "h-full w-full flex-1 transition-all duration-300 ease-in-out",
          fillClassName || "bg-primary"
        )}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  );
});
Progress.displayName = "Progress";

export { Progress };
