import { useProgress } from '@react-three/drei';
import { useEffect, useState } from 'react';

import { exploreInfo } from '../../constants';

const LoadingScreen = () => {
  const { progress, active } = useProgress();
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  useEffect(() => {
    if (!active) {
      setTimeout(() => setShowLoadingScreen(false), 500);
    }
  }, [active]);

  if (!showLoadingScreen) return null;

  return (
    <div
      className={`loading-screen ${active ? '' : 'loading-screen--fade-out'}`}
    >
      <div className="loading-screen__container">
        <h1 className="loading-screen__title">{exploreInfo.title}</h1>
        <div className="loading-screen__progress-container">
          <div
            className="loading-screen__progress-bar"
            style={{ width: `${progress}%` }}
          >
            <div className="loading-screen__progress-glow" />
          </div>
          <span className="loading-screen__progress-text">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
