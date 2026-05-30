import type {
  Card3DVariant,
  CardSettings,
} from "@/components/shared/effects/card-3d/types";

export const CARD_VARIANTS = {
  book: {
    glare: true,
    glareIntensity: 0.8,
    parallaxIntensity: 0.04,
    rotationIntensity: 6,
    thickness: 20,
  },
  compact: {
    glare: true,
    glareIntensity: 0.6,
    parallaxIntensity: 0.01,
    rotationIntensity: 2,
    thickness: 4,
  },
  dramatic: {
    glare: true,
    glareIntensity: 0.8,
    parallaxIntensity: 0.1,
    rotationIntensity: 10,
    thickness: 16,
  },
  media: {
    glare: true,
    glareIntensity: 0.8,
    parallaxIntensity: 0.05,
    rotationIntensity: 4,
    thickness: 4,
  },
  skill: {
    glare: true,
    glareIntensity: 0.6,
    parallaxIntensity: 0,
    rotationIntensity: 4,
    thickness: 12,
  },
  standard: {
    glare: true,
    glareIntensity: 0.8,
    parallaxIntensity: 0,
    rotationIntensity: 3,
    thickness: 10,
  },
  subtle: {
    glare: false,
    glareIntensity: 0.8,
    parallaxIntensity: 0.02,
    rotationIntensity: 2,
    thickness: 8,
  },
  text: {
    glare: true,
    glareIntensity: 0.8,
    parallaxIntensity: 0,
    rotationIntensity: 2,
    thickness: 8,
  },
} as const satisfies Record<Card3DVariant, CardSettings>;
