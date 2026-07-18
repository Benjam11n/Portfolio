export const getThemeWaveColor = (
  resolvedTheme: string | undefined
): [number, number, number] =>
  resolvedTheme === "light" ? [0.95, 0.95, 0.95] : [0.42, 0.42, 0.42];

export const shouldDisableDitherAnimation = ({
  disableAnimation,
  prefersReducedMotion,
  skipAnimations,
}: DitherAnimationOptions) =>
  disableAnimation || prefersReducedMotion || skipAnimations;

interface DitherAnimationOptions {
  disableAnimation: boolean;
  prefersReducedMotion: boolean;
  skipAnimations: boolean;
}

export const shouldEnableDitherMouse = (
  enableMouseInteraction: boolean,
  isEffectivelyPaused: boolean
) => enableMouseInteraction && !isEffectivelyPaused;
