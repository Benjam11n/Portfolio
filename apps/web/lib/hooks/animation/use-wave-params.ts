"use client";

import { useFrame } from "@react-three/fiber";
import { type RefObject, useEffect, useRef } from "react";
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
  colorNum: Uniform<number>;
  pixelSize: Uniform<number>;
  mousePos: Uniform<Vector2>;
  enableMouseInteraction: Uniform<number>;
  mouseRadius: Uniform<number>;
};

type WaveParamsOptions = {
  waveSpeed?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  waveColor?: [number, number, number];
  colorNum?: number;
  pixelSize?: number;
  enableMouseInteraction?: boolean;
  mouseRadius?: number;
  disableAnimation?: boolean;
  isActive?: boolean;
  wakeUntilRef?: RefObject<number>;
  mousePos?: RefObject<Vector2>;
};

export const useWaveParams = (options: WaveParamsOptions = {}) => {
  const {
    waveSpeed = 0.05,
    waveFrequency = 3,
    waveAmplitude = 0.3,
    waveColor = [0.5, 0.5, 0.5],
    colorNum = 4,
    pixelSize = 2,
    enableMouseInteraction = true,
    mouseRadius = 1,
    disableAnimation = false,
    isActive = true,
    wakeUntilRef,
    mousePos: externalMousePos,
  } = options;

  const waveUniformsRef = useRef<WaveUniforms>({
    time: new Uniform(0),
    resolution: new Uniform(new Vector2(0, 0)),
    waveSpeed: new Uniform(waveSpeed),
    waveFrequency: new Uniform(waveFrequency),
    waveAmplitude: new Uniform(waveAmplitude),
    waveColor: new Uniform(new Color(...waveColor)),
    colorNum: new Uniform(colorNum),
    pixelSize: new Uniform(pixelSize),
    mousePos: new Uniform(new Vector2(0, 0)),
    enableMouseInteraction: new Uniform(enableMouseInteraction ? 1 : 0),
    mouseRadius: new Uniform(mouseRadius),
  });

  useEffect(() => {
    waveUniformsRef.current.waveSpeed.value = waveSpeed;
  }, [waveSpeed]);

  useEffect(() => {
    waveUniformsRef.current.waveFrequency.value = waveFrequency;
  }, [waveFrequency]);

  useEffect(() => {
    waveUniformsRef.current.waveAmplitude.value = waveAmplitude;
  }, [waveAmplitude]);

  useEffect(() => {
    waveUniformsRef.current.waveColor.value.set(...waveColor);
  }, [waveColor[0], waveColor[1], waveColor[2]]);

  useEffect(() => {
    waveUniformsRef.current.colorNum.value = colorNum;
  }, [colorNum]);

  useEffect(() => {
    waveUniformsRef.current.pixelSize.value = pixelSize;
  }, [pixelSize]);

  useEffect(() => {
    waveUniformsRef.current.enableMouseInteraction.value =
      enableMouseInteraction ? 1 : 0;
  }, [enableMouseInteraction]);

  useEffect(() => {
    waveUniformsRef.current.mouseRadius.value = mouseRadius;
  }, [mouseRadius]);

  useFrame((_, delta) => {
    if (!isActive) {
      return;
    }

    const u = waveUniformsRef.current;
    const shouldAdvanceTime =
      !disableAnimation &&
      (wakeUntilRef ? performance.now() < wakeUntilRef.current : true);

    if (shouldAdvanceTime) {
      u.time.value += delta;
    }

    if (enableMouseInteraction && externalMousePos?.current) {
      u.mousePos.value.copy(externalMousePos.current);
    }
  });

  return {
    waveUniforms: waveUniformsRef,
  };
};
