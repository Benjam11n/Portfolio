"use client";

import { useGSAP } from "@gsap/react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import {
  createElement,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
} from "react";
import type { Mesh } from "three";
import { waveFragmentShader, waveVertexShader } from "@/lib/constants/shaders";
import { useAnimationSkipContext } from "@/lib/contexts/animation-skip-context";
import { useWaveParams } from "@/lib/hooks/animation/use-wave-params";
import { useElementVisibility } from "@/lib/hooks/ui/use-element-visibility";
import { useMouseInteraction } from "@/lib/hooks/ui/use-mouse-interaction";
import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";

const INITIAL_WAKE_MS = 5000;
const INTERACTION_WAKE_MS = 200;
const PROP_CHANGE_WAKE_MS = 250;

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
  shouldWake: boolean;
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
  shouldWake,
}: DitheredWavesProps) {
  const lastWakeTriggerKeyRef = useRef("");
  const mesh = useRef<Mesh>(null);
  const wakeUntilRef = useRef(0);
  const { invalidate, viewport, size, gl } = useThree();

  const wake = useEffectEvent((durationMs: number) => {
    if (!(isActive && shouldWake)) {
      return;
    }

    wakeUntilRef.current = Math.max(
      wakeUntilRef.current,
      performance.now() + durationMs
    );
    invalidate();
  });

  const wakeTriggerKey = useMemo(
    () =>
      [
        waveSpeed,
        waveFrequency,
        waveAmplitude,
        waveColor[0],
        waveColor[1],
        waveColor[2],
        colorNum,
        pixelSize,
        enableMouseInteraction,
        mouseRadius,
        size.width,
        size.height,
      ].join(":"),
    [
      colorNum,
      enableMouseInteraction,
      mouseRadius,
      pixelSize,
      size.height,
      size.width,
      waveAmplitude,
      waveColor,
      waveFrequency,
      waveSpeed,
    ]
  );

  const { mousePos } = useMouseInteraction({
    enabled: isActive && shouldWake && enableMouseInteraction,
    gl,
    onPointerMove: () => wake(INTERACTION_WAKE_MS),
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
    wakeUntilRef,
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

  useEffect(() => {
    if (!isActive) {
      wakeUntilRef.current = 0;
      return;
    }

    if (!shouldWake) {
      invalidate();
      return;
    }

    wake(INITIAL_WAKE_MS);
  }, [invalidate, isActive, shouldWake]);

  useEffect(() => {
    if (!isActive) {
      lastWakeTriggerKeyRef.current = "";
      return;
    }

    if (!shouldWake) {
      lastWakeTriggerKeyRef.current = wakeTriggerKey;
      invalidate();
      return;
    }

    if (lastWakeTriggerKeyRef.current === wakeTriggerKey) {
      return;
    }

    lastWakeTriggerKeyRef.current = wakeTriggerKey;
    wake(PROP_CHANGE_WAKE_MS);
  }, [invalidate, isActive, shouldWake, wakeTriggerKey]);

  useFrame(() => {
    if (!(isActive && shouldWake)) {
      return;
    }

    if (performance.now() < wakeUntilRef.current) {
      invalidate();
    }
  });

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
  waveColor = [0.5, 0.5, 0.5],
  colorNum = 4,
  pixelSize = 2,
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 1,
}: DitherProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { skipAnimations } = useAnimationSkipContext();
  const isActive = useElementVisibility(containerRef);

  // Respect user's motion preference
  const shouldDisableAnimation =
    disableAnimation || prefersReducedMotion || skipAnimations;

  useGSAP(
    () => {
      // Skip animation if user prefers reduced motion
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
          frameloop={isActive ? "demand" : "never"}
          gl={{
            antialias: false,
            powerPreference: "low-power",
            preserveDrawingBuffer: false,
          }}
        >
          <DitheredWaves
            colorNum={colorNum}
            disableAnimation={shouldDisableAnimation}
            enableMouseInteraction={
              enableMouseInteraction && !shouldDisableAnimation
            }
            isActive={isActive}
            mouseRadius={mouseRadius}
            pixelSize={pixelSize}
            shouldWake={!shouldDisableAnimation}
            waveAmplitude={waveAmplitude}
            waveColor={waveColor}
            waveFrequency={waveFrequency}
            waveSpeed={waveSpeed}
          />
        </Canvas>
      </div>
    </div>
  );
}
