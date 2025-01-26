'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { easing } from 'maath';
import { useMobile } from '@/hooks/use-mobile';

import { ReactNode } from 'react';

const HeroCamera = ({ children }: { children: ReactNode }) => {
  const { isMobile } = useMobile();
  const groupRef = useRef();

  useFrame((state, delta) => {
    easing.damp3(state.camera.position, [0, 0, 20], 0.25, delta);

    if (!isMobile) {
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
