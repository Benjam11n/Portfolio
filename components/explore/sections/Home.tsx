import { Center, Float } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import * as THREE from 'three';

import { exploreInfo } from '@/constants';
import { useMobile } from '@/hooks/use-mobile';

import { BirchTree } from '../models/BirchTree';
import { MacBookPro } from '../models/MacBookPro';
import { OrangeBird } from '../models/OrangeBird';
import { SectionTitle } from '../SectionTitle';


const Home = () => {
  const { isMobile, scaleFactor } = useMobile();
  return (
    <motion.group
      position-y={-5}
      variants={{
        home: {
          y: 0,
        },
      }}
    >
      <Float floatIntensity={2} speed={2}>
        <MacBookPro
          position-x={isMobile ? -0.7 : -1.5}
          position-y={isMobile ? 1 : 0.7}
          position-z={isMobile ? -2 : 0}
          scale={isMobile ? 0.3 : 0.35}
          rotation-y={Math.PI / 4}
        />
      </Float>
      <BirchTree
        scale={isMobile ? 0.0023 : 0.0038}
        rotation-y={THREE.MathUtils.degToRad(140)}
        position={isMobile ? [1.2, -0.1, -3] : [3.5 * scaleFactor, -0.1, -5]}
      />
      <OrangeBird
        scale={isMobile ? 0.15 : 0.25}
        rotation-y={-Math.PI / 12}
        position={isMobile ? [1.6, 0, -3] : [3.5 * scaleFactor, 0, -3]}
      />
      <group scale={isMobile ? 0.3 : 1}>
        <Float floatIntensity={0.6}>
          <Center disableY disableZ>
            <SectionTitle
              size={0.8}
              position-y={1.6}
              position-z={-3}
              bevelEnabled
              bevelThickness={0.3}
            >
              {exploreInfo.home.title}
            </SectionTitle>
          </Center>
        </Float>
        <Center disableY disableZ>
          <SectionTitle
            size={1.2}
            position-x={-2.6}
            position-z={-3}
            bevelEnabled
            bevelThickness={0.3}
            rotation-y={Math.PI / 10}
          >
            {exploreInfo.home.subtitle}
          </SectionTitle>
        </Center>
      </group>
    </motion.group>
  );
};

export default Home;
