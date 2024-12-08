import { Float } from '@react-three/drei';
import { motion } from 'framer-motion-3d';

import { SECTIONS_DISTANCE } from '../../constants';
import { useMobile } from '../../hooks/useMobile';
import { Balloon } from '../components/models/Balloon';
import { Grass } from '../components/models/Grass';
import { Mailbox } from '../components/models/Mailbox';
import { ParkBench } from '../components/models/ParkBench';
import { Pigeon } from '../components/models/Pigeon';
import { SectionTitle } from '../components/SectionTitle';

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
        <Grass
          scale={0.4}
          position-x={isMobile ? 1.8 : 2.6}
          position-z={0.55}
          rotation-y={Math.PI / 2}
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

      <Mailbox
        scale={0.25}
        rotation-y={1.25 * Math.PI}
        position-x={1}
        position-y={0.25}
        position-z={0.5}
      />
      <Float>
        <Pigeon
          position-x={isMobile ? 0 : 2 * scaleFactor}
          position-y={isMobile ? 2.2 : 1.5}
          position-z={-0.05}
          scale={0.3}
        />
      </Float>
    </motion.group>
  );
};

export default Contact;
