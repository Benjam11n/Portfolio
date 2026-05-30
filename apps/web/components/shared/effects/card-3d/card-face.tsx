import type { ReactNode, RefObject } from "react";

import { CardGlare } from "@/components/shared/effects/card-3d/card-glare";
import { cn } from "@/lib/utils";

interface CardFaceProps {
  children: ReactNode;
  className?: string;
  contentRef: RefObject<HTMLDivElement | null>;
  glareEnabled: boolean;
  glareRef: RefObject<HTMLDivElement | null>;
}

export const CardFace = ({
  children,
  className,
  contentRef,
  glareEnabled,
  glareRef,
}: CardFaceProps) => (
  <div
    className={cn(
      "relative h-full w-full overflow-hidden rounded-xl bg-card",
      className
    )}
    style={{ backfaceVisibility: "hidden" }}
  >
    <div className="relative z-10 h-full w-full" ref={contentRef}>
      {children}
    </div>
    <CardGlare enabled={glareEnabled} glareRef={glareRef} />
  </div>
);
