import { Canvas } from '@react-three/fiber';
import { Scroll, ScrollControls } from '@react-three/drei';
import { config } from '../constants/config.js';
import { MotionConfig } from 'framer-motion';
import { Interface } from './components/Interface.jsx';
import Menu from './components/Menu.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import { Suspense } from 'react';
import CameraController from './components/CameraController.jsx';
import { Experience } from './Experience.jsx';

const ExploreView = () => {
  return (
    <>
      <LoadingScreen />
      <Canvas camera={{ position: [0, 0.5, 5], fov: 42 }}>
        <color attach="background" args={['#0d0d0d']} />
        <fog attach="fog" args={['#0d0d0d', 10, 50]} />
        <CameraController />
        <ambientLight intensity={0.5} />
        <ScrollControls
          pages={config.sections.length + 0.05}
          damping={0.1}
          maxSpeed={0.2}
        >
          <group position-y={-1}>
            <MotionConfig transition={{ duration: 0.6 }}>
              <Suspense>
                <Experience />
              </Suspense>
            </MotionConfig>
          </group>
          <Scroll html>
            <MotionConfig transition={{ duration: 1 }}>
              <Interface />
            </MotionConfig>
          </Scroll>
        </ScrollControls>
      </Canvas>
      {/* <Menu /> */}
    </>
  );
};

export default ExploreView;
