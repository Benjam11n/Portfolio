import { useGLTF } from '@react-three/drei';
import React from 'react';
import type * as THREE from 'three';
import type { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    iMac: THREE.Mesh;
  };
  materials: {
    Mat: THREE.MeshStandardMaterial;
  };
};

export const Monitor = (props: JSX.IntrinsicElements['group']) => {
  const { nodes, materials } = useGLTF('/models/Monitor.glb') as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.iMac.geometry} material={materials.Mat} />
    </group>
  );
}

useGLTF.preload('/models/Monitor.glb');
