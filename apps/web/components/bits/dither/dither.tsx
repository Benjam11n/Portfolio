"use client";

import { useGSAP } from "@gsap/react";
import { Canvas } from "@react-three/fiber";
import gsapCore from "gsap";
import { useTheme } from "next-themes";
import { useRef } from "react";

import {
  HIGH_TIER_DITHER_DPR,
  HIGH_TIER_DITHER_FPS,
  MEDIUM_TIER_DITHER_DPR,
  MEDIUM_TIER_DITHER_FPS,
} from "@/components/bits/dither/constants";
import { DitheredWaves } from "@/components/bits/dither/dithered-waves";
import { useDitherControls } from "@/components/bits/dither/use-dither-controls";
import {
  getThemeWaveColor,
  shouldDisableDitherAnimation,
  shouldEnableDitherMouse,
} from "@/components/bits/dither/utils";
import { useAnimationSkipContext } from "@/lib/contexts/animation-skip-context";
import { useVisualPerformanceTier } from "@/lib/hooks/performance/use-visual-performance-tier";
import { useElementVisibility } from "@/lib/hooks/ui/use-element-visibility";

export interface DitherProps {
  waveSpeed?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  waveColor?: [number, number, number];
  colorNum?: number;
  pixelSize?: number;
  disableAnimation?: boolean;
  enableMouseInteraction?: boolean;
  mouseRadius?: number;
}

export const Dither = ({
  waveSpeed = 0.05,
  waveFrequency = 3,
  waveAmplitude = 0.3,
  waveColor,
  colorNum = 4,
  pixelSize = 2,
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 1,
}: DitherProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const visualPerformanceTier = useVisualPerformanceTier();
  const shouldReduceMotion = visualPerformanceTier === "low";
  const ditherDpr =
    visualPerformanceTier === "medium"
      ? MEDIUM_TIER_DITHER_DPR
      : HIGH_TIER_DITHER_DPR;
  const framesPerSecond =
    visualPerformanceTier === "medium"
      ? MEDIUM_TIER_DITHER_FPS
      : HIGH_TIER_DITHER_FPS;
  const { skipAnimations, setSkipAnimations } = useAnimationSkipContext();
  const isActive = useElementVisibility(containerRef);
  const { resolvedTheme } = useTheme();

  const currentWaveColor = waveColor || getThemeWaveColor(resolvedTheme);
  const shouldDisableAnimation = shouldDisableDitherAnimation({
    disableAnimation,
    shouldReduceMotion,
    skipAnimations,
  });
  const { handleContainerClick, isEffectivelyPaused } = useDitherControls({
    setSkipAnimations,
    shouldDisableAnimation,
    skipAnimations,
  });
  const shouldEnableMouse = shouldEnableDitherMouse(
    enableMouseInteraction,
    isEffectivelyPaused
  );

  useGSAP(
    () => {
      if (shouldReduceMotion || skipAnimations) {
        if (containerRef.current) {
          containerRef.current.style.opacity = "1";
        }
        return;
      }

      gsapCore.to(containerRef.current, {
        delay: 0.2,
        duration: 1.5,
        ease: "power2.out",
        opacity: 1,
      });
    },
    {
      dependencies: [shouldReduceMotion, skipAnimations],
      scope: containerRef,
    }
  );

  return (
    <div
      aria-hidden="true"
      className="h-full w-full cursor-pointer opacity-0"
      onClick={handleContainerClick}
      ref={containerRef}
    >
      <div className="relative h-full w-full">
        <Canvas
          camera={{ position: [0, 0, 6] }}
          dpr={ditherDpr}
          frameloop="demand"
          gl={{
            antialias: false,
            powerPreference: "low-power",
            preserveDrawingBuffer: false,
          }}
        >
          <DitheredWaves
            colorNum={colorNum}
            disableAnimation={isEffectivelyPaused}
            enableMouseInteraction={shouldEnableMouse}
            framesPerSecond={framesPerSecond}
            isActive={isActive}
            mouseRadius={mouseRadius}
            pixelSize={pixelSize}
            waveAmplitude={waveAmplitude}
            waveColor={currentWaveColor as [number, number, number]}
            waveFrequency={waveFrequency}
            waveSpeed={waveSpeed}
          />
        </Canvas>
      </div>
    </div>
  );
};
