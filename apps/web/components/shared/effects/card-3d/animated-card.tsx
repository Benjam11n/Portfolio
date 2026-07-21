"use client";

import type { ReactNode } from "react";

import { CardDepth } from "@/components/shared/effects/card-3d/card-depth";
import { CardFace } from "@/components/shared/effects/card-3d/card-face";
import type { useCard3DHandlers } from "@/components/shared/effects/card-3d/hooks";
import type {
  CardRefs,
  CardSettings,
} from "@/components/shared/effects/card-3d/types";
import { getAnimatedCardClassName } from "@/components/shared/effects/card-3d/utils";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  handlers: ReturnType<typeof useCard3DHandlers>;
  shouldReduceMotion: boolean;
  refs: CardRefs;
  settings: CardSettings;
  shadow?: boolean;
  sideColor?: string;
}

export const AnimatedCard = ({
  children,
  className,
  containerClassName,
  handlers,
  shouldReduceMotion,
  refs,
  settings,
  shadow,
  sideColor,
}: AnimatedCardProps) => {
  const primaryEdgeColor = sideColor || "hsl(var(--muted))";
  const secondaryEdgeColor = sideColor || "hsl(var(--muted-foreground) / 0.3)";
  const cardClassName = getAnimatedCardClassName({
    shadow,
    shouldReduceMotion,
  });

  return (
    <div
      className={cn("relative h-full w-full", containerClassName)}
      onMouseLeave={handlers.handleMouseLeave}
      onMouseMove={handlers.handleMouseMove}
      ref={refs.containerRef}
      role="presentation"
      style={{ perspective: 1000 }}
    >
      <div
        className={cardClassName}
        ref={refs.cardRef}
        style={{ transformStyle: "preserve-3d" }}
      >
        <CardFace
          className={className}
          contentRef={refs.contentRef}
          glareEnabled={settings.glare}
          glareRef={refs.glareRef}
        >
          {children}
        </CardFace>
        <CardDepth
          primaryEdgeColor={primaryEdgeColor}
          secondaryEdgeColor={secondaryEdgeColor}
          thickness={settings.thickness}
        />
      </div>
    </div>
  );
};
