"use client";

import type { ReactNode } from "react";

import { AnimatedCard } from "@/components/shared/effects/card-3d/animated-card";
import {
  useCard3DHandlers,
  useCardRefs,
} from "@/components/shared/effects/card-3d/hooks";
import { StaticCard } from "@/components/shared/effects/card-3d/static-card";
import type { Card3DVariant } from "@/components/shared/effects/card-3d/types";
import { getCardSettings } from "@/components/shared/effects/card-3d/utils";
import { useShouldReduceMotion } from "@/lib/hooks/performance/use-should-reduce-motion";
import { useIsSafari } from "@/lib/hooks/utils/use-is-safari";
import { useMobileDetection } from "@/lib/hooks/utils/use-mobile-detection";

interface Card3DProps {
  children: ReactNode;
  variant?: Card3DVariant;
  thickness?: number;
  sideColor?: string;
  rotationIntensity?: number;
  parallaxIntensity?: number;
  glare?: boolean;
  glareIntensity?: number;
  shadow?: boolean;
  className?: string;
  containerClassName?: string;
}

export const Card3D = ({
  children,
  variant,
  thickness,
  sideColor,
  rotationIntensity,
  parallaxIntensity,
  glare,
  glareIntensity,
  shadow = true,
  className,
  containerClassName,
}: Card3DProps) => {
  const refs = useCardRefs();
  const shouldReduceMotion = useShouldReduceMotion();
  const isSafari = useIsSafari();
  const isMobile = useMobileDetection();
  const shouldDisable3D = shouldReduceMotion || isMobile || isSafari;
  const settings = getCardSettings({
    glare,
    glareIntensity,
    parallaxIntensity,
    rotationIntensity,
    thickness,
    variant,
  });
  const handlers = useCard3DHandlers({
    refs,
    settings,
    shouldDisable3D,
  });

  if (shouldDisable3D) {
    return (
      <StaticCard
        className={className}
        containerClassName={containerClassName}
        shadow={shadow}
      >
        {children}
      </StaticCard>
    );
  }

  return (
    <AnimatedCard
      className={className}
      containerClassName={containerClassName}
      handlers={handlers}
      shouldReduceMotion={shouldReduceMotion}
      refs={refs}
      settings={settings}
      shadow={shadow}
      sideColor={sideColor}
    >
      {children}
    </AnimatedCard>
  );
};
