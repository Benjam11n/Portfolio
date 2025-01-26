'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function FloatingShape({
  position,
  color,
  speed = 1,
}: {
  position: [number, number, number];
  color: string;
  speed?: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.position.y = position[1] + Math.sin(time * speed) * 0.3;
      mesh.current.rotation.x = time * 0.5;
      mesh.current.rotation.y = time * 0.2;
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <octahedronGeometry args={[1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Shapes() {
  return (
    <>
      <FloatingShape position={[-4, 0, -5]} color="#ff6b6b" speed={1.2} />
      <FloatingShape position={[4, 0, -2]} color="#4ecdc4" speed={0.8} />
      <FloatingShape position={[0, 0, -8]} color="#45b7d1" speed={1} />
    </>
  );
}

export default function Scene() {
  return (
    <div className="h-screen w-full absolute top-0 left-0 -z-10">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Shapes />
      </Canvas>
    </div>
  );
}
