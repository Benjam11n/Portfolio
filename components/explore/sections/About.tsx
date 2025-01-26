import { SpotLight } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import { Physics, RigidBody } from '@react-three/rapier';

import { Apple } from '../models/Apple';
import { SectionTitle } from '../SectionTitle';
import WhiteboardSection from '../WhiteboardSection';
import { useMobile } from '@/hooks/use-mobile';
import { ComputerDesk } from '../models/ComputerDesk';
import {
  leftWhiteboardTexts,
  rightWhiteboardTexts,
  SECTIONS_DISTANCE,
} from '@/constants';

const About = () => {
  const { isMobile } = useMobile();
  return (
    <motion.group
      position-x={isMobile ? SECTIONS_DISTANCE : 0}
      position-z={isMobile ? -4 : SECTIONS_DISTANCE}
      position-y={-5}
      variants={{ about: { y: 0 } }}
    >
      <group position-x={isMobile ? 0 : -2.2}>
        {/* Section Title */}
        <SectionTitle
          position-x={isMobile ? -1.2 : -0.3}
          position-z={isMobile ? 2 : 0.2}
          rotation-y={isMobile ? Math.PI / 8 : Math.PI / 6}
        >
          ABOUT
        </SectionTitle>
        {/* Left Whiteboard Section */}
        <WhiteboardSection
          position={{
            x: isMobile ? 0 : 0.5,
            y: isMobile ? 2 : 1,
            z: isMobile ? 1 : -1,
          }}
          rotation={isMobile ? 0 : Math.PI / 4}
          texts={leftWhiteboardTexts}
          isMobile={isMobile}
        />
        {/* Right Whiteboard Section */}
        {!isMobile && (
          <WhiteboardSection
            position={{ x: 4, y: 1, z: -1 }}
            rotation={-Math.PI / 4}
            texts={rightWhiteboardTexts}
            isRight
            isMobile={isMobile}
          />
        )}
        {/* Physics Objects */}
        <Physics>
          <Apple
            scale={14}
            position={isMobile ? [-1, 0.9, 1] : [3.9, 0.85, -0.7]}
            rotation-y={-Math.PI / 4}
          />
          <RigidBody type="fixed">
            <ComputerDesk
              scale={1.1}
              position-x={isMobile ? -1 : 3.9}
              position-z={isMobile ? 1 : -0.8}
              rotation-y={isMobile ? Math.PI / 6 : -Math.PI / 4}
            />
          </RigidBody>
        </Physics>
        {/* Lighting */}
        {/* Main light for left whiteboard */}
        <SpotLight
          position={isMobile ? [0, 4, 2] : [-1, 4, 0]}
          angle={0.3}
          intensity={20}
          penumbra={0.8}
          color="#ffffff"
          castShadow
          distance={10}
          target-position={isMobile ? [0, 1.8, 1] : [0.5, 1, -1]}
        />

        {/* Ambient fill light */}
        <pointLight position={[0, 3, 0]} intensity={0.5} color="#ffffe0" />

        {/* Right whiteboard light (only for desktop) */}
        {!isMobile && (
          <SpotLight
            position={[5, 4, 0]}
            angle={0.3}
            intensity={20}
            penumbra={0.8}
            color="#ffffff"
            castShadow
            distance={10}
            target-position={[-1, 1, -1]}
          />
        )}
      </group>
    </motion.group>
  );
};

export default About;
