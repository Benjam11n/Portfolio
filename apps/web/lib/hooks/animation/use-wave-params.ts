"use client";

import { useFrame } from "@react-three/fiber";
import { type RefObject, useRef } from "react";
import { Color, Uniform, Vector2 } from "three";

type WaveUniforms = {
  // biome-ignore lint/suspicious/noExplicitAny: Three.js uniforms can be any type
  [key: string]: Uniform<any>;
  time: Uniform<number>;
  resolution: Uniform<Vector2>;
  waveSpeed: Uniform<number>;
  waveFrequency: Uniform<number>;
  waveAmplitude: Uniform<number>;
  waveColor: Uniform<Color>;
  mousePos: Uniform<Vector2>;
  enableMouseInteraction: Uniform<number>;
  mouseRadius: Uniform<number>;
};

type WaveParamsOptions = {
  waveSpeed?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  waveColor?: [number, number, number];
  enableMouseInteraction?: boolean;
  mouseRadius?: number;
  disableAnimation?: boolean;
  isActive?: boolean;
  mousePos?: RefObject<Vector2>;
};

export const useWaveParams = (options: WaveParamsOptions = {}) => {
  const {
    waveSpeed = 0.05,
    waveFrequency = 3,
    waveAmplitude = 0.3,
    waveColor = [0.5, 0.5, 0.5],
    enableMouseInteraction = true,
    mouseRadius = 1,
    disableAnimation = false,
    isActive = true,
    mousePos: externalMousePos,
  } = options;

  const waveUniformsRef = useRef<WaveUniforms>({
    time: new Uniform(0),
    resolution: new Uniform(new Vector2(0, 0)),
    waveSpeed: new Uniform(waveSpeed),
    waveFrequency: new Uniform(waveFrequency),
    waveAmplitude: new Uniform(waveAmplitude),
    waveColor: new Uniform(new Color(...waveColor)),
    mousePos: new Uniform(new Vector2(0, 0)),
    enableMouseInteraction: new Uniform(enableMouseInteraction ? 1 : 0),
    mouseRadius: new Uniform(mouseRadius),
  });

  const prevColor = useRef([...waveColor]);

  useFrame(({ clock }) => {
    if (!isActive) {
      return;
    }

    const u = waveUniformsRef.current;

    if (!disableAnimation) {
      u.time.value = clock.getElapsedTime();
    }

    if (u.waveSpeed.value !== waveSpeed) {
      u.waveSpeed.value = waveSpeed;
    }
    if (u.waveFrequency.value !== waveFrequency) {
      u.waveFrequency.value = waveFrequency;
    }
    if (u.waveAmplitude.value !== waveAmplitude) {
      u.waveAmplitude.value = waveAmplitude;
    }

    if (!prevColor.current.every((v, i) => v === waveColor[i])) {
      u.waveColor.value.set(...waveColor);
      prevColor.current = [...waveColor];
    }

    u.enableMouseInteraction.value = enableMouseInteraction ? 1 : 0;
    u.mouseRadius.value = mouseRadius;

    if (enableMouseInteraction && externalMousePos?.current) {
      u.mousePos.value.copy(externalMousePos.current);
    }
  });

  return {
    waveUniforms: waveUniformsRef,
  };
};
