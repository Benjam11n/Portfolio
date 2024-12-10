import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera, SpotLight } from '@react-three/drei';
import { Suspense } from 'react';
import CanvasLoader from '../components/CanvasLoader';
import { calculateSizes } from '../../constants';
import HeroCamera from '../components/HeroCamera';
import Button from '../components/Button';
import { Lab } from '../components/Lab';
import Avatar from '../components/Avatar';
import { useMobile } from '../../hooks/useMobile';

const Hero = () => {
  const { isSmall, isMobile, isTablet } = useMobile();
  const sizes = calculateSizes(isSmall, isMobile, isTablet);

  return (
    <section className="min-h-screen w-full flex flex-col relative" id="home">
      <div className="w-full mx-auto flex flex-col sm:mt-36 mt-20 c-space gap-3">
        <p className="sm:text-3xl text-2xl font-medium text-white text-center font-generalsans z-20">
          Hi, I am Benjamin
          <span className="waving-hand z-20">👋</span>
        </p>
        <p className="hero_tag text-white_gradient z-20">
          Engineering Dreams into Reality
        </p>
        <div className="w-full h-full absolute inset-0">
          <Canvas>
            <Suspense fallback={<CanvasLoader />}>
              <Environment preset="sunset" />
              <PerspectiveCamera makeDefault position={[0, 0, 20]} />
              <HeroCamera>
                <SpotLight
                  position={sizes.spotlightPosition}
                  angle={0.7}
                  intensity={10}
                  penumbra={0.5}
                  color="#ffb885"
                  castShadow
                  distance={10}
                  target-position={[0, -5, 0.1]}
                />
                <Lab
                  position={sizes.labPosition}
                  scale={0.008}
                  rotation={[0, -Math.PI / 4, 0]}
                />
                <Avatar scale={4} position={sizes.avatarPosition} />
              </HeroCamera>
              <group>
                {/* <ReactLogo position={sizes.reactLogoPosition} />
                <Cube position={sizes.cubePosition} />
                <Rings position={sizes.ringPosition} /> */}
              </group>
            </Suspense>
          </Canvas>
        </div>

        <div className="absolute bottom-7 left-0 right-0 w-full z-10 c-space">
          <a href="#about" className="w-fit">
            <Button
              name="Let's work together"
              isBeam
              containerClass="sm:w-fit w-full sm:min-w-96"
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
