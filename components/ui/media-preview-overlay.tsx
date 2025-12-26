import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MediaPreviewOverlayProps = {
  children?: ReactNode;
  icon?: ReactNode;
  label?: string;
  className?: string;
};

export const MediaPreviewOverlay = ({
  children,
  icon,
  label = "Click to expand",
  className,
}: MediaPreviewOverlayProps) => {
  return (
    <div
      className={cn(
        "group absolute inset-0 flex items-center justify-center bg-black/0 transition-colors hover:bg-black/10",
        className
      )}
    >
      <div className="translate-y-4 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
        <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 font-medium text-black text-sm shadow-lg backdrop-blur-sm">
          {icon}
          {children || label}
        </div>
      </div>
    </div>
  );
};
