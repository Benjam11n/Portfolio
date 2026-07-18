"use client";

import { useBackgroundVisibility } from "@/components/layout/background-visibility";
import { DynamicDither } from "@/components/layout/dynamic-layout-components";
import { useDeferredEnhancement } from "@/lib/hooks/performance/use-deferred-enhancement";
import { useShouldReduceEffects } from "@/lib/hooks/performance/use-should-reduce-effects";

export const PersistentBackground = () => {
  const { isBackgroundDisabled } = useBackgroundVisibility();
  const shouldReduceEffects = useShouldReduceEffects();
  const enableDither = useDeferredEnhancement({
    activateOnInteraction: false,
    delayMs: 1600,
  });

  if (!enableDither || isBackgroundDisabled || shouldReduceEffects) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-0 h-full w-full opacity-70">
      <DynamicDither
        colorNum={3}
        disableAnimation={false}
        enableMouseInteraction={false}
        mouseRadius={0.6}
        pixelSize={1}
        waveAmplitude={0.2}
        waveColor={undefined}
        waveFrequency={2}
        waveSpeed={0.04}
      />
    </div>
  );
};
