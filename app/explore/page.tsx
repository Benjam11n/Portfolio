'use client';
import { PerformanceMonitor, Scroll, ScrollControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { MotionConfig } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';

import CameraController from '@/components/explore/CameraController';
import { Experience } from '@/components/explore/Experience';
import { Interface } from '@/components/explore/Interface';
import LoadingScreen from '@/components/explore/LoadingScreen';
import PerformanceWarning from '@/components/explore/PerformanceWarning';
import { exploreInfo } from '@/constants';

const ExplorePage = () => {
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);

  const shouldShowWarning = () => {
    const lastDismissed = localStorage.getItem('performanceWarningDismissed');
    if (!lastDismissed) return true;
    const ONE_HOUR = 30 * 60 * 1000;
    return Date.now() - parseInt(lastDismissed) > ONE_HOUR;
  };

  const handlePerformanceDecline = ({ fps }: { fps: number }) => {
    if (fps < 30 && shouldShowWarning()) {
      setShowWarning(true);
    }
  };

  return (
    <div className="relative h-screen w-full">
      <LoadingScreen />
      {showWarning && (
        <PerformanceWarning
          onSwitch={() => router.push('/list')}
          onDismiss={() => setShowWarning(false)}
        />
      )}
      <Canvas camera={{ position: [0, 0.5, 5], fov: 42 }} className="relative h-screen w-full">
        <PerformanceMonitor onDecline={handlePerformanceDecline} threshold={0.8} />
        <color attach="background" args={['#010103']} />
        <fog attach="fog" args={['#0d0d0d', 10, 50]} />
        <CameraController />
        <ambientLight intensity={0.5} />
        <ScrollControls pages={exploreInfo.sections.length + 0.05} damping={0.1} maxSpeed={0.2}>
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
    </div>
  );
};

export default ExplorePage;
