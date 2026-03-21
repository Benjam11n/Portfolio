"use client";

import { useGSAP } from "@gsap/react";
import { Canvas, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useTheme } from "next-themes";
import { createElement, useEffect, useRef, useState } from "react";
import type { Mesh } from "three";
import { waveFragmentShader, waveVertexShader } from "@/lib/constants/shaders";
import { useAnimationSkipContext } from "@/lib/contexts/animation-skip-context";
import { useWaveParams } from "@/lib/hooks/animation/use-wave-params";
import { useElementVisibility } from "@/lib/hooks/ui/use-element-visibility";
import { useMouseInteraction } from "@/lib/hooks/ui/use-mouse-interaction";
import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";

const AUTO_PAUSE_AFTER_MS = 1000 * 60;

type DitheredWavesProps = {
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
};

function DitheredWaves({
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
}: DitheredWavesProps) {
  const mesh = useRef<Mesh>(null);
  const { viewport, size, gl } = useThree();

  const { mousePos } = useMouseInteraction({
    enabled: isActive && enableMouseInteraction,
    gl,
  });

  const { waveUniforms } = useWaveParams({
    waveSpeed,
    waveFrequency,
    waveAmplitude,
    waveColor,
    colorNum,
    pixelSize,
    enableMouseInteraction,
    mouseRadius,
    disableAnimation,
    isActive,
    mousePos,
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
}

type DitherProps = {
  waveSpeed?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  waveColor?: [number, number, number];
  colorNum?: number;
  pixelSize?: number;
  disableAnimation?: boolean;
  enableMouseInteraction?: boolean;
  mouseRadius?: number;
};

export function Dither({
  waveSpeed = 0.05,
  waveFrequency = 3,
  waveAmplitude = 0.3,
  waveColor,
  colorNum = 4,
  pixelSize = 2,
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 1,
}: DitherProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pauseAtRef = useRef<number | null>(null);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { skipAnimations } = useAnimationSkipContext();
  const isActive = useElementVisibility(containerRef);
  const { resolvedTheme } = useTheme();

  const currentWaveColor =
    waveColor ||
    (resolvedTheme === "light" ? [0.95, 0.95, 0.95] : [0.42, 0.42, 0.42]);

  const shouldDisableAnimation =
    disableAnimation || prefersReducedMotion || skipAnimations;
  const shouldAnimate = isActive && !shouldDisableAnimation && !hasTimedOut;

  useEffect(() => {
    if (pauseAtRef.current === null) {
      pauseAtRef.current = Date.now() + AUTO_PAUSE_AFTER_MS;
    }

    if (hasTimedOut || shouldDisableAnimation) {
      return;
    }

    const remainingMs = pauseAtRef.current - Date.now();
    if (remainingMs <= 0) {
      setHasTimedOut(true);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setHasTimedOut(true);
    }, remainingMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [hasTimedOut, shouldDisableAnimation]);

  useGSAP(
    () => {
      if (prefersReducedMotion || skipAnimations) {
        if (containerRef.current) {
          containerRef.current.style.opacity = "1";
        }
        return;
      }

      gsap.to(containerRef.current, {
        opacity: 1,
        duration: 1.5,
        ease: "power2.out",
        delay: 0.2,
      });
    },
    {
      scope: containerRef,
      dependencies: [prefersReducedMotion, skipAnimations],
    }
  );

  return (
    <div
      aria-hidden="true"
      className="h-full w-full opacity-0"
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
            disableAnimation={shouldDisableAnimation || hasTimedOut}
            enableMouseInteraction={
              enableMouseInteraction && !shouldDisableAnimation && !hasTimedOut
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
}
