'use client';

import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

const REFERENCE_WIDTH = 1920;

export const useMobile = () => {
  const isSmall = useMediaQuery({ maxWidth: 440 });
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 });
  const [scaleFactor, setScaleFactor] = useState(window?.innerWidth / REFERENCE_WIDTH);
  const handleResize = () => {};

  useEffect(() => {
    setScaleFactor(window?.innerWidth / REFERENCE_WIDTH);

    window?.addEventListener('resize', handleResize);
    return () => removeEventListener('resize', handleResize);
  }, []);

  return { scaleFactor, isSmall, isMobile, isTablet };
};
