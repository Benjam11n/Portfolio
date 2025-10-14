'use client';

import { useProgress } from '@react-three/drei';
import { useEffect, useState } from 'react';

import { TextShimmer } from '@/components/ui/text-shimmer';

const LoadingScreen = () => {
  const { active } = useProgress();
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  useEffect(() => {
    if (!active) {
      setTimeout(() => setShowLoadingScreen(false), 500);
    }
  }, [active]);

  if (!showLoadingScreen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#0a0a0a] transition-opacity duration-500 ease-out">
      <TextShimmer as="h1" className="text-xl font-bold tracking-wide md:text-2xl" duration={1.5}>
        Loading...
      </TextShimmer>
    </div>
  );
};

export default LoadingScreen;
