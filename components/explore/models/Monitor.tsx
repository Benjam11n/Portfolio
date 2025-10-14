import { useGLTF } from '@react-three/drei';
import React from 'react';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    iMac: THREE.Mesh;
  };
  materials: {
    Mat: THREE.MeshStandardMaterial;
  };
};

export function Monitor(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/models/Monitor.glb') as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.iMac.geometry} material={materials.Mat} />
    </group>
  );
}

useGLTF.preload('/models/Monitor.glb');
