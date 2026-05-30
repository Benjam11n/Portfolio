import { CARD_VARIANTS } from "@/components/shared/effects/card-3d/constants";
import type {
  Card3DVariant,
  CardSettings,
} from "@/components/shared/effects/card-3d/types";
import { cn } from "@/lib/utils";

interface CardSettingsInput {
  variant?: Card3DVariant;
  thickness?: number;
  rotationIntensity?: number;
  parallaxIntensity?: number;
  glare?: boolean;
  glareIntensity?: number;
}

const withDefault = <T>(value: T | undefined, defaultValue: T) =>
  value ?? defaultValue;

export const getCardSettings = ({
  glare,
  glareIntensity,
  parallaxIntensity,
  rotationIntensity,
  thickness,
  variant,
}: CardSettingsInput): CardSettings => {
  const defaults = variant ? CARD_VARIANTS[variant] : CARD_VARIANTS.standard;

  return {
    glare: withDefault(glare, defaults.glare),
    glareIntensity: withDefault(glareIntensity, defaults.glareIntensity),
    parallaxIntensity: withDefault(
      parallaxIntensity,
      defaults.parallaxIntensity
    ),
    rotationIntensity: withDefault(
      rotationIntensity,
      defaults.rotationIntensity
    ),
    thickness: withDefault(thickness, defaults.thickness),
  };
};

interface AnimatedCardClassNameOptions {
  prefersReducedMotion: boolean;
  shadow?: boolean;
}

export const getAnimatedCardClassName = ({
  prefersReducedMotion,
  shadow,
}: AnimatedCardClassNameOptions) => {
  if (!shadow) {
    return "relative h-full w-full rounded-xl transition-shadow";
  }

  return cn(
    "relative h-full w-full rounded-xl transition-shadow",
    prefersReducedMotion ? "shadow-xl" : "hover:shadow-2xl"
  );
};
