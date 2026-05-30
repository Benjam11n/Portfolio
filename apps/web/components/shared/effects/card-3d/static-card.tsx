import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface StaticCardProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  shadow?: boolean;
}

export const StaticCard = ({
  children,
  className,
  containerClassName,
  shadow,
}: StaticCardProps) => (
  <div className={cn("relative h-full w-full", containerClassName)}>
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-xl bg-card",
        shadow && "shadow-xl",
        className
      )}
    >
      {children}
    </div>
  </div>
);
