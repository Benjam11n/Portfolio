'use client';

import { ContactShadows, Environment, SpotLight, useScroll } from '@react-three/drei';
import type { GroupProps } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import { motion } from 'framer-motion-3d';
import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';
import type * as THREE from 'three';

import { Avatar } from './models/Avatar';
import About from './sections/About';
import Contact from './sections/Contact';
import ExperienceSection from './sections/ExperienceSection';
import Home from './sections/Home';
import Projects from './sections/Projects';
import Certifications from './sections/Certifications';

import { useMobile } from '@/hooks/use-mobile';
import { exploreInfo, SECTIONS_DISTANCE } from '@/constants';

export const Experience = () => {
  const [section, setSection] = useState(exploreInfo.sections[0]);
  const sceneContainer = useRef<THREE.Group>(null);
  const frontSpotlightRef = useRef<THREE.SpotLight>(null);
  const backSpotlightRef = useRef<THREE.SpotLight>(null);
  const scrollData = useScroll();
  const { isMobile } = useMobile();

  useFrame(() => {
    if (!sceneContainer.current) return;

    if (isMobile) {
      sceneContainer.current.position.x =
        -scrollData.offset * SECTIONS_DISTANCE * (scrollData.pages - 1);
      sceneContainer.current.position.z = 0;
    } else {
      sceneContainer.current.position.z =
        -scrollData.offset * SECTIONS_DISTANCE * (scrollData.pages - 1);
      sceneContainer.current.position.x = 0;
    }

    setSection(exploreInfo.sections[Math.round(scrollData.offset * (scrollData.pages - 1))]);

    // Update spotlights
    if (frontSpotlightRef.current && backSpotlightRef.current) {
      const scrollProgress = scrollData.offset;

      // For mobile
      if (isMobile) {
        frontSpotlightRef.current.position.x =
          3 - scrollProgress * SECTIONS_DISTANCE * (scrollData.pages - 1);
        backSpotlightRef.current.position.x =
          -3 - scrollProgress * SECTIONS_DISTANCE * (scrollData.pages - 1);
      }
      // For desktop
      else {
        frontSpotlightRef.current.position.z =
          1 - scrollProgress * SECTIONS_DISTANCE * (scrollData.pages - 1);
        backSpotlightRef.current.position.z =
          1 - scrollProgress * SECTIONS_DISTANCE * (scrollData.pages - 1);
      }

      // Fade intensity based on scroll position
      const fadeEffect = 1 - Math.abs(scrollProgress - 0.5) * 2;
      frontSpotlightRef.current.intensity = 1 + fadeEffect;
      backSpotlightRef.current.intensity = 1 + fadeEffect;
    }
  });

  useEffect(() => {
    const handleHashChange = () => {
      const sectionIndex = exploreInfo.sections.indexOf(window.location.hash.replace('#', ''));
      if (sectionIndex >= 0) {
        scrollData.el.scrollTo(
          0,
          (sectionIndex / (exploreInfo.sections.length - 1)) *
            (scrollData.el.scrollHeight - scrollData.el.clientHeight),
        );
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [scrollData.el]);

  return (
    <>
      <Environment preset="sunset" />
      <Avatar position-z={isMobile ? -5 : 0} />
      {/* Spotlight */}
      <SpotLight
        ref={frontSpotlightRef}
        position={[5, 5, 0]}
        angle={0.5}
        intensity={20}
        penumbra={0.5}
        color="#ff125d"
        castShadow
        distance={20}
      />
      <SpotLight
        ref={backSpotlightRef}
        position={[-5, 5, 0]}
        angle={0.5}
        intensity={20}
        penumbra={0.5}
        color="#9412ff"
        castShadow
        distance={20}
      />
      <ContactShadows opacity={0.4} scale={[30, 30]} color="#ff5c5c" blur={2.5} far={10} />
      {/* Black floor plane */}
      <Physics>
        <RigidBody type="fixed">
          <mesh position-y={-0.001} rotation-x={-Math.PI / 2}>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#0a0a0a" metalness={0} envMapIntensity={0.2} />
          </mesh>
        </RigidBody>
      </Physics>
      <motion.group ref={sceneContainer as unknown as RefObject<GroupProps>} animate={section}>
        {/* HOME */}
        <Home />
        {/* ABOUT */}
        <About />
        {/* EXPERIENCE */}
        <ExperienceSection />
        {/* PROJECTS */}
        <Projects />
        {/* CERTIFICATIONS */}
        <Certifications />
        {/* CONTACT */}
        <Contact />
      </motion.group>
    </>
  );
};
