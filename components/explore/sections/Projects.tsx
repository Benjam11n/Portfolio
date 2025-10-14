import { RoundedBox } from '@react-three/drei';
import { motion } from 'framer-motion-3d';

import { SECTIONS_DISTANCE } from '@/constants';
import { useMobile } from '@/hooks/use-mobile';

import { Monitor } from '../models/Monitor';
import MonitorScreen from '../models/MonitorScreen';
import { SectionTitle } from '../SectionTitle';

const Projects = () => {
  const { isMobile } = useMobile();

  return (
    <motion.group
      position-x={isMobile ? 3 * SECTIONS_DISTANCE : 0}
      position-z={isMobile ? -3 : 3 * SECTIONS_DISTANCE}
      position-y={-5}
      variants={{ projects: { y: 0 } }}
    >
      <group position-x={isMobile ? -0.25 : 1}>
        <SectionTitle
          position-x={-0.5}
          position-y={isMobile ? 2.2 : 0}
          position-z={0}
          rotation-y={isMobile ? 0 : -Math.PI / 6}
        >
          PROJECTS
        </SectionTitle>
        <group position-x={isMobile ? 1 : 0.5} position-z={0} rotation-y={-Math.PI / 6} scale={0.8}>
          <MonitorScreen rotation-x={-0.18} position-z={-0.895} position-y={1.74} />
          <Monitor scale={0.02} position-y={1} rotation-y={-Math.PI / 2} position-z={-1} />
          <RoundedBox scale-x={2} position-y={0.5} position-z={-1}>
            <meshStandardMaterial color="white" />
          </RoundedBox>
        </group>
      </group>
    </motion.group>
  );
};

export default Projects;
