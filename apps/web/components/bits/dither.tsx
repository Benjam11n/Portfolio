"use client";

import { useGSAP } from "@gsap/react";
import { Canvas, useThree } from "@react-three/fiber";
import gsapCore from "gsap";
import { useTheme } from "next-themes";
import { createElement, useCallback, useEffect, useRef, useState } from "react";
import type { Mesh } from "three";

import { waveFragmentShader, waveVertexShader } from "@/lib/constants/shaders";
import { useAnimationSkipContext } from "@/lib/contexts/animation-skip-context";
import { useWaveParams } from "@/lib/hooks/animation/use-wave-params";
import { useElementVisibility } from "@/lib/hooks/ui/use-element-visibility";
import { useMouseInteraction } from "@/lib/hooks/ui/use-mouse-interaction";
import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";

const AUTO_PAUSE_AFTER_MS = 15_000;

interface DitheredWavesProps {
  waveSpeed: number;
  waveFrequency: number;
  waveAmplitude: number;
  waveColor: [number, number, number];
  colorNum: number;
  pixelSize: number;
  disableAnimation: boolean;
  isActive: boolean;
  enableMouseInteraction: boolean;
  mouseRadius: number;
}

const DitheredWaves = ({
  waveSpeed,
  waveFrequency,
  waveAmplitude,
  waveColor,
  colorNum,
  pixelSize,
  disableAnimation,
  isActive,
  enableMouseInteraction,
  mouseRadius,
}: DitheredWavesProps) => {
  const mesh = useRef<Mesh>(null);
  const { viewport, size, gl } = useThree();

  const { mousePos } = useMouseInteraction({
    enabled: isActive && enableMouseInteraction,
    gl,
  });

  const { waveUniforms } = useWaveParams({
    colorNum,
    disableAnimation,
    enableMouseInteraction,
    isActive,
    mousePos,
    mouseRadius,
    pixelSize,
    waveAmplitude,
    waveColor,
    waveFrequency,
    waveSpeed,
  });

  useEffect(() => {
    const dpr = gl.getPixelRatio();
    const newWidth = Math.floor(size.width * dpr);
    const newHeight = Math.floor(size.height * dpr);
    const currentRes = waveUniforms.current.resolution.value;
    if (currentRes.x !== newWidth || currentRes.y !== newHeight) {
      currentRes.set(newWidth, newHeight);
    }
  }, [size, gl, waveUniforms]);

  return createElement(
    "mesh",
    { ref: mesh, scale: [viewport.width, viewport.height, 1] },
    createElement("planeGeometry", { args: [1, 1] }),
    createElement("shaderMaterial", {
      fragmentShader: waveFragmentShader,
      uniforms: waveUniforms.current,
      vertexShader: waveVertexShader,
    })
  );
};

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

  // Animation Control States
  const [isIdle, setIsIdle] = useState(false);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const lastActivityRef = useRef<number>(Date.now());

  const prefersReducedMotion = usePrefersReducedMotion();
  const { skipAnimations } = useAnimationSkipContext();
  const isActive = useElementVisibility(containerRef);
  const { resolvedTheme } = useTheme();

  const currentWaveColor =
    waveColor ||
    (resolvedTheme === "light" ? [0.95, 0.95, 0.95] : [0.42, 0.42, 0.42]);

  const shouldDisableAnimation =
    disableAnimation || prefersReducedMotion || skipAnimations;

  const isEffectivelyPaused =
    shouldDisableAnimation || isManuallyPaused || isIdle;
  const shouldAnimate = isActive && !isEffectivelyPaused;

  // 1. Handle Global Activity -> Idle Timeout (30s)
  useEffect(() => {
    if (shouldDisableAnimation || isManuallyPaused) {
      return;
    }

    const handleActivity = () => {
      lastActivityRef.current = Date.now();
      if (isIdle) {
        setIsIdle(false);
      }
    };

    // Throttle activity listener to avoid layout thrashing
    let throttleTimeout: number | null = null;
    const throttledActivity = () => {
      if (throttleTimeout) {
        return;
      }
      handleActivity();
      throttleTimeout = window.setTimeout(() => {
        throttleTimeout = null;
      }, 500);
    };

    // Listen to all major user behaviors
    window.addEventListener("mousemove", throttledActivity, { passive: true });
    window.addEventListener("keydown", throttledActivity, { passive: true });
    window.addEventListener("touchstart", throttledActivity, { passive: true });
    window.addEventListener("scroll", throttledActivity, { passive: true });

    // Check every second if auto-pause time has passed without activity
    const intervalId = window.setInterval(() => {
      if (Date.now() - lastActivityRef.current > AUTO_PAUSE_AFTER_MS) {
        setIsIdle(true);
      }
    }, 1000);

    return () => {
      window.removeEventListener("mousemove", throttledActivity);
      window.removeEventListener("keydown", throttledActivity);
      window.removeEventListener("touchstart", throttledActivity);
      window.removeEventListener("scroll", throttledActivity);
      window.clearInterval(intervalId);
      if (throttleTimeout) {
        window.clearTimeout(throttleTimeout);
      }
    };
  }, [isIdle, shouldDisableAnimation, isManuallyPaused]);

  // 2. Handle Escape Key to Manually Pause/Play
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsManuallyPaused((prev) => {
          const nextState = !prev;
          if (!nextState) {
            // Unpausing resets idle timer
            lastActivityRef.current = Date.now();
            setIsIdle(false);
          }
          return nextState;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 3. Handle Direct Click on Background
  const handleContainerClick = useCallback(() => {
    setIsManuallyPaused((prev) => {
      const nextState = !prev;
      if (!nextState) {
        // Unpausing resets idle timer
        lastActivityRef.current = Date.now();
        setIsIdle(false);
      }
      return nextState;
    });
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion || skipAnimations) {
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
      dependencies: [prefersReducedMotion, skipAnimations],
      scope: containerRef,
    }
  );

  return (
    <div
      aria-hidden="true"
      className="h-full w-full cursor-pointer opacity-0"
      data-hover-cursor=""
      data-hover-cursor-label={
        isEffectivelyPaused ? "Play Dither" : "Pause Dither"
      }
      onClick={handleContainerClick}
      ref={containerRef}
    >
      <div className="relative h-full w-full">
        <Canvas
          camera={{ position: [0, 0, 6] }}
          dpr={[0.75, 1]}
          frameloop={shouldAnimate ? "always" : "never"}
          gl={{
            antialias: false,
            powerPreference: "low-power",
            preserveDrawingBuffer: false,
          }}
        >
          <DitheredWaves
            colorNum={colorNum}
            disableAnimation={isEffectivelyPaused}
            enableMouseInteraction={
              enableMouseInteraction && !isEffectivelyPaused
            }
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
