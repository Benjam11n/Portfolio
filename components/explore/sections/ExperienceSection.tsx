import { motion } from 'framer-motion-3d';

import { SECTIONS_DISTANCE } from '@/constants';
import { useMobile } from '@/hooks/use-mobile';

import { BookCase } from '../models/BookCase';
import { CouchSmall } from '../models/CouchSmall';
import { Lamp } from '../models/Lamp';
import { SectionTitle } from '../SectionTitle';

const ExperienceSection = () => {
  const { isMobile } = useMobile();

  return (
    <motion.group
      position-x={isMobile ? 2 * SECTIONS_DISTANCE : 0}
      position-z={isMobile ? -4 : 2 * SECTIONS_DISTANCE}
      position-y={-5}
      variants={{ experience: { y: 0 } }}
    >
      <group position-x={isMobile ? 0 : 1}>
        <SectionTitle
          position-x={isMobile ? -1.2 : -0.5}
          position-y={isMobile ? 2 : 0}
          position-z={isMobile ? -1.6 : -0.6}
          rotation-y={isMobile ? 0 : -Math.PI / 6}
        >
          EXPERIENCE
        </SectionTitle>
      </group>
      <group position-x={isMobile ? 0 : -2.2}>
        <BookCase position-z={-2} />
        <CouchSmall
          scale={0.4}
          position-z={0}
          position-x={-0.02}
          rotation-y={Math.PI / 3}
        />
        <Lamp
          position-z={0.6}
          position-x={-0.4}
          position-y={-0.8}
          rotation-y={-Math.PI}
        />
      </group>
    </motion.group>
  );
};

export default ExperienceSection;
