"use client";

import { DynamicDither } from "@/components/layout/dynamic-layout-components";
import { useDeferredEnhancement } from "@/lib/hooks/performance/use-deferred-enhancement";

export const PersistentBackground = () => {
  const enableDither = useDeferredEnhancement({
    activateOnInteraction: false,
    delayMs: 1600,
  });

  if (!enableDither) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-0 h-full w-full opacity-70">
      <DynamicDither
        colorNum={3}
        disableAnimation={false}
        enableMouseInteraction
        mouseRadius={0.6}
        pixelSize={2}
        waveAmplitude={0.2}
        waveColor={undefined}
        waveFrequency={2}
        waveSpeed={0.04}
      />
    </div>
  );
};
