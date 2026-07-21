"use client";

import { useThree } from "@react-three/fiber";
import { createElement, useEffect, useRef } from "react";
import type { Mesh } from "three";

import { waveFragmentShader, waveVertexShader } from "@/lib/constants/shaders";
import { useWaveParams } from "@/lib/hooks/animation/use-wave-params";
import { useMouseInteraction } from "@/lib/hooks/ui/use-mouse-interaction";

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
  framesPerSecond: number;
}

export const DitheredWaves = ({
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
  framesPerSecond,
}: DitheredWavesProps) => {
  const mesh = useRef<Mesh>(null);
  const { viewport, size, gl, invalidate } = useThree();
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
    invalidate();

    if (!(isActive && !disableAnimation)) {
      return;
    }

    const intervalId = window.setInterval(invalidate, 1000 / framesPerSecond);

    return () => window.clearInterval(intervalId);
  }, [disableAnimation, framesPerSecond, invalidate, isActive]);

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
