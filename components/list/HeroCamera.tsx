'use client';

import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { useRef } from 'react';
import { ReactNode } from 'react';
import * as THREE from 'three';

import { useMobile } from '@/hooks/use-mobile';

const HeroCamera = ({ children }: { children: ReactNode }) => {
  const { isMobile } = useMobile();
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    easing.damp3(state.camera.position, [0, 0, 20], 0.25, delta);

    if (!isMobile && groupRef.current) {
      easing.dampE(
        groupRef.current.rotation,
        [state.pointer.y / 10, -state.pointer.x / 5, 0],
        0.25,
        delta
      );
    }
  });

  return (
    <group scale={isMobile ? 1 : 1.3} ref={groupRef}>
      {children}
    </group>
  );
};

export default HeroCamera;
