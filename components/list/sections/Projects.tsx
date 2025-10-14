'use client';

import { Center, OrbitControls } from '@react-three/drei';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Suspense, useState } from 'react';

import { PROJECTS } from '../../../constants';
import CanvasLoader from '../CanvasLoader';
import { DemoComputer } from '../DemoComputer';

const DynamicCanvas = dynamic(() => import('@react-three/fiber').then((mod) => mod.Canvas), {
  ssr: false,
});

const Projects = () => {
  const projectKeys = Object.keys(PROJECTS);
  const projectCount = projectKeys.length;
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const currentProject = PROJECTS[projectKeys[selectedProjectIndex]];

  const handleNavigation = (direction: 'previous' | 'next') => {
    setSelectedProjectIndex((prev) => {
      if (direction === 'previous') {
        return prev === 0 ? projectCount - 1 : prev - 1;
      } else {
        return prev === projectCount - 1 ? 0 : prev + 1;
      }
    });
  };

  return (
    <section className="c-space my-20" id="projects">
      <h2 className="font-comic mb-4 max-w-4xl text-3xl md:text-5xl">My Projects</h2>
      <div className="mt-12 grid w-full grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="relative flex flex-col gap-5 rounded-md px-5 py-10 shadow-2xl sm:p-10">
          <div className="absolute top-0 right-0 h-96 w-full">
            <Image
              src={currentProject.spotlight}
              alt="spotlight"
              className="rounded-md object-cover"
              fill
            />
          </div>

          <div className="w-fit rounded-lg p-3 backdrop-blur-3xl" style={currentProject.logoStyle}>
            <Image
              src={currentProject.logo}
              alt="logo"
              className="size-10 rounded-md shadow-sm"
              width={40}
              height={40}
            />
          </div>

          <div className="my-5 flex flex-col gap-5">
            <p className="text-2xl font-semibold">{currentProject.title}</p>
            <p>{currentProject.description}</p>
            <p>{currentProject.subdesc}</p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              {currentProject.techStack.map((tag, index) => (
                <div key={index} className="tech-logo">
                  <Image src={tag.path} alt={tag.name} width={24} height={24} />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {currentProject.github && (
                <a
                  className="flex cursor-pointer items-center gap-2"
                  href={currentProject.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="View GitHub Repository"
                >
                  <Image
                    src="/assets/github.svg"
                    alt="GitHub"
                    width={24}
                    height={24}
                    className="opacity-80 transition-opacity hover:opacity-100"
                  />
                </a>
              )}

              {currentProject?.href && (
                <a
                  className="flex cursor-pointer items-center gap-2"
                  href={currentProject.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <p>View Project</p>
                  <Image src="/assets/arrow-up.png" alt="arrow" width={12} height={12} />
                </a>
              )}
            </div>
          </div>

          <div className="mt-7 flex items-center justify-between">
            <button className="arrow-btn" onClick={() => handleNavigation('previous')}>
              <Image src="/assets/left-arrow.png" alt="left arrow" width={16} height={16} />
            </button>
            <button className="arrow-btn" onClick={() => handleNavigation('next')}>
              <Image src="/assets/right-arrow.png" alt="right arrow" width={16} height={16} />
            </button>
          </div>
        </div>

        <div className="h-96 rounded-lg border md:h-full">
          <DynamicCanvas className="rounded-md">
            <ambientLight intensity={Math.PI} />
            <directionalLight position={[10, 10, 5]} />

            <Center>
              <Suspense fallback={<CanvasLoader />}>
                <group scale={2} position={[0, -3, 0]} rotation={[0, -0.1, 0]}>
                  <DemoComputer texture={currentProject.texture} />
                </group>
              </Suspense>
            </Center>
            <OrbitControls
              maxPolarAngle={Math.PI / 2}
              minAzimuthAngle={-Math.PI / 4}
              maxAzimuthAngle={Math.PI / 4}
              enableZoom={false}
            />
          </DynamicCanvas>
        </div>
      </div>
    </section>
  );
};

export default Projects;
