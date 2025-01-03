import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor, Scroll, ScrollControls } from '@react-three/drei';
import { exploreInfo } from '../constants';
import { MotionConfig } from 'framer-motion';
import { Interface } from './components/Interface.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import { Suspense } from 'react';
import CameraController from './components/CameraController.jsx';
import { Experience } from './Experience.jsx';
import PerformanceWarning from './PerformanceWarning.jsx';

import { useState } from 'react';

const ExploreView = ({ setCurrentView }) => {
  const [showWarning, setShowWarning] = useState(false);

  const shouldShowWarning = () => {
    const lastDismissed = localStorage.getItem('performanceWarningDismissed');
    console.log(lastDismissed);
    if (!lastDismissed) return true;

    // Don't show warning if less than 30 minutes have passed
    const ONE_HOUR = 30 * 60 * 1000;
    return Date.now() - parseInt(lastDismissed) > ONE_HOUR;
  };

  const handlePerformanceDecline = ({ fps }) => {
    if (fps < 30 && shouldShowWarning()) {
      console.log('Declined');
      setShowWarning(true);
    }
  };

  return (
    <>
      <LoadingScreen />
      {showWarning && (
        <PerformanceWarning
          onSwitch={() => setCurrentView(false)}
          onDismiss={() => setShowWarning(false)}
        />
      )}
      <Canvas camera={{ position: [0, 0.5, 5], fov: 42 }}>
        <PerformanceMonitor
          onDecline={handlePerformanceDecline}
          threshold={0.8}
          minFPS={30}
        />
        <color attach="background" args={['#010103']} />
        <fog attach="fog" args={['#0d0d0d', 10, 50]} />
        <CameraController />
        <ambientLight intensity={0.5} />
        <ScrollControls
          pages={exploreInfo.sections.length + 0.05}
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
    </>
  );
};

export default ExploreView;
