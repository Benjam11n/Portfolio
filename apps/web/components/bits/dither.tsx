"use client";

import { useGSAP } from "@gsap/react";
import { Canvas, useThree } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import type { Mesh } from "three";
import { waveFragmentShader, waveVertexShader } from "@/lib/constants/shaders";
import { useMouseInteraction } from "@/lib/hooks/use-mouse-interaction";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { RetroEffect } from "@/lib/hooks/use-retro-effect";
import { useWaveParams } from "@/lib/hooks/use-wave-params";

type DitheredWavesProps = {
  waveSpeed: number;
  waveFrequency: number;
  waveAmplitude: number;
  waveColor: [number, number, number];
  colorNum: number;
  pixelSize: number;
  disableAnimation: boolean;
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
  enableMouseInteraction,
  mouseRadius,
}: DitheredWavesProps) {
  const mesh = useRef<Mesh>(null);
  const { viewport, size, gl } = useThree();

  const { mousePos } = useMouseInteraction({
    enabled: enableMouseInteraction,
    gl,
  });

  const { waveUniforms } = useWaveParams({
    waveSpeed,
    waveFrequency,
    waveAmplitude,
    waveColor,
    enableMouseInteraction,
    mouseRadius,
    disableAnimation,
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

  return (
    <>
      <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          fragmentShader={waveFragmentShader}
          uniforms={waveUniforms.current}
          vertexShader={waveVertexShader}
        />
      </mesh>

      <EffectComposer>
        <RetroEffect colorNum={colorNum} pixelSize={pixelSize} />
      </EffectComposer>
    </>
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
  waveColor = [0.5, 0.5, 0.5],
  colorNum = 4,
  pixelSize = 2,
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 1,
}: DitherProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Respect user's motion preference
  const shouldDisableAnimation = disableAnimation || prefersReducedMotion;

  useGSAP(
    () => {
      // Skip animation if user prefers reduced motion
      if (prefersReducedMotion) {
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
    { scope: containerRef, dependencies: [prefersReducedMotion] }
  );

  return (
    // aria-hidden: This is a decorative background element with no semantic content
    // Screen readers should skip this entirely
    <div
      aria-hidden="true"
      className="h-full w-full opacity-0"
      ref={containerRef}
    >
      <Canvas
        camera={{ position: [0, 0, 6] }}
        className="relative h-full w-full"
        dpr={1}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
      >
        <DitheredWaves
          colorNum={colorNum}
          disableAnimation={shouldDisableAnimation}
          enableMouseInteraction={enableMouseInteraction}
          mouseRadius={mouseRadius}
          pixelSize={pixelSize}
          waveAmplitude={waveAmplitude}
          waveColor={waveColor}
          waveFrequency={waveFrequency}
          waveSpeed={waveSpeed}
        />
      </Canvas>
    </div>
  );
}
