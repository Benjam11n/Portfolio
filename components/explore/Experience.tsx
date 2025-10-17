'use client';
/* eslint-disable react/no-unknown-property */

import { ContactShadows, Environment, SpotLight, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import { motion } from 'framer-motion-3d';
import { useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import type * as THREE from 'three';

import { Avatar } from './models/Avatar';
import { activeSectionAtom, navJumpAtom } from './atoms';
import About from './sections/About';
import Contact from './sections/Contact';
import ExperienceSection from './sections/ExperienceSection';
import Home from './sections/Home';
import Projects from './sections/Projects';

import { useMobile } from '@/hooks/use-mobile';
import { exploreInfo, SECTIONS_DISTANCE } from '@/constants';

export const Experience = () => {
  const [activeSection, setActiveSection] = useAtom(activeSectionAtom);
  const [, setNavJump] = useAtom(navJumpAtom);
  const sceneContainer = useRef<THREE.Group>(null);
  const frontSpotlightRef = useRef<THREE.SpotLight>(null);
  const backSpotlightRef = useRef<THREE.SpotLight>(null);
  const scrollData = useScroll();
  const { isMobile } = useMobile();

  useFrame(() => {
    if (!sceneContainer.current) return;

    const sectionsCount = exploreInfo.sections.length;
    const span = sectionsCount - 1;
    if (isMobile) {
      sceneContainer.current.position.x = -scrollData.offset * SECTIONS_DISTANCE * span;
      sceneContainer.current.position.z = 0;
    } else {
      sceneContainer.current.position.z = -scrollData.offset * SECTIONS_DISTANCE * span;
      sceneContainer.current.position.x = 0;
    }

    const index = Math.round(scrollData.offset * span);
    const nextSection = exploreInfo.sections[index] ?? exploreInfo.sections[0];
    if (nextSection !== activeSection) {
      setActiveSection(nextSection);
      // Update hash without firing a 'hashchange' event to avoid feedback loops
      try {
        const url = `${window.location.pathname}#${nextSection}`;
        window.history.replaceState(null, '', url);
      } catch (err) {
        // noop: hash update is non-critical
      }
    }

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
    if (!scrollData.el) return;

    const scrollToSection = (hash: string) => {
      const sectionIndex = exploreInfo.sections.indexOf(hash.replace('#', ''));
      if (sectionIndex < 0) return;

      const { el } = scrollData;
      const targetTop =
        (sectionIndex / (exploreInfo.sections.length - 1)) * (el.scrollHeight - el.clientHeight);

      try {
        // Smoothly animate programmatic scroll to ensure walking animation engages
        el.scrollTo({ top: targetTop, behavior: 'smooth' });
        // Nudge avatar to walk visibly during navbar-initiated jumps
        setNavJump(Date.now());
      } catch {
        // Fallback for environments without smooth behavior (no direct mutation)
        el.scrollTo(0, targetTop);
        setNavJump(Date.now());
      }
    };

    const handleHashChange = () => scrollToSection(window.location.hash);

    // Sync on mount if a hash is already present
    if (window.location.hash) {
      scrollToSection(window.location.hash);
    }

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
          <mesh position={[0, -0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#0a0a0a" />
          </mesh>
        </RigidBody>
      </Physics>
      <motion.group animate={activeSection}>
        <group ref={sceneContainer}>
          {/* HOME */}
          <Home />
          {/* ABOUT */}
          <About />
          {/* EXPERIENCE */}
          <ExperienceSection />
          {/* PROJECTS */}
          <Projects />
          {/* CONTACT */}
          <Contact />
        </group>
      </motion.group>
    </>
  );
};
