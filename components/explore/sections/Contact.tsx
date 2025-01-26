import { Float } from '@react-three/drei';
import { motion } from 'framer-motion-3d';

import { SECTIONS_DISTANCE } from '@/constants';
import { SectionTitle } from '../SectionTitle';
import { ParkBench } from '../models/ParkBench';
import { Balloon } from '../models/Balloon';
import { Tree } from '../models/Tree';
import { OrangeBird } from '../models/OrangeBird';
import { Mailbox } from '../models/Mailbox';
import { useMobile } from '@/hooks/use-mobile';

const Contact = () => {
  const { isMobile, scaleFactor } = useMobile();

  return (
    <motion.group
      position-x={isMobile ? 4 * SECTIONS_DISTANCE : 0}
      position-z={isMobile ? -4 : 4 * SECTIONS_DISTANCE}
      position-y={-5}
      variants={{ contact: { y: 0 } }}
    >
      <SectionTitle
        position-x={isMobile ? -1.1 : -2 * scaleFactor}
        position-z={0.8}
        rotation-y={-Math.PI / 32}
      >
        CONTACT
      </SectionTitle>
      <group position-x={-2 * scaleFactor}>
        <ParkBench
          scale={0.5}
          position-x={-0.5}
          position-z={-2.5}
          rotation-y={-Math.PI / 4}
        />
        <group position-y={2.2} position-z={-0.5}>
          <Float floatIntensity={2} rotationIntensity={1.5}>
            <Balloon scale={1.5} position-x={-0.5} color="#71a2d9" />
          </Float>
          <Float floatIntensity={1.5} rotationIntensity={2} position-z={0.5}>
            <Balloon scale={1.3} color="#d97183" />
          </Float>
          <Float speed={2} rotationIntensity={2}>
            <Balloon scale={1.6} position-x={0.4} color="yellow" />
          </Float>
        </group>
      </group>

      <Tree
        scale={0.52}
        rotation-y={1.25 * Math.PI}
        position-x={isMobile ? 1.7 : 2.2}
        position-z={-1.5}
      />
      <OrangeBird
        scale={0.2}
        rotation-y={-Math.PI / 8}
        position-x={isMobile ? 1.5 : 2.2}
        position-z={isMobile ? 0.5 : 0}
      />
      <Mailbox
        scale={0.25}
        rotation-y={1.25 * Math.PI}
        position-x={1}
        position-y={0.25}
        position-z={0.5}
      />
    </motion.group>
  );
};

export default Contact;
