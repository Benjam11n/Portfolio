'use client';

import { useState } from 'react';
import Globe from 'react-globe.gl';
import Button from '../Button';
import { exploreInfo } from '@/constants';
import { Gravity, MatterBody } from '@/components/ui/gravity';
import { cn } from '@/lib/utils';
import { TextShimmer } from '@/components/ui/text-shimmer';
import {
  Box,
  Braces,
  Cloud,
  Code2,
  Container,
  Database,
  Server,
} from 'lucide-react';
import Image from 'next/image';

interface Skill {
  name: string;
  color: string;
  size: 'sm' | 'md' | 'lg' | 'xl';
  icon: (props: { className: string }) => JSX.Element;
}

const skills: Skill[] = [
  {
    name: 'React',
    color: '#001b59', // Darker React blue for better contrast
    size: 'xl',
    icon: (props) => (
      <Image
        src="/assets/react.svg"
        alt="React"
        width={24}
        height={24}
        className={props.className}
      />
    ),
  },
  {
    name: 'TypeScript',
    color: '#3178C6', // Already good contrast
    size: 'xl',
    icon: (props) => (
      <Image
        src="/assets/typescript.svg"
        alt="TypeScript"
        width={24}
        height={24}
        className={props.className}
      />
    ),
  },
  {
    name: 'Next.js',
    color: '#FFFFFF', // Slightly lighter than pure black
    size: 'lg',
    icon: (props) => (
      <Image
        src="/assets/nextjs.svg"
        alt="Next.js"
        width={24}
        height={24}
        className={props.className}
      />
    ),
  },
  {
    name: 'Node.js',
    color: '#215732', // Darker Node.js green for better contrast
    size: 'lg',
    icon: (props) => (
      <Image
        src="/assets/node.svg"
        alt="Node.js"
        width={24}
        height={24}
        className={props.className}
      />
    ),
  },
  {
    name: 'Python',
    color: '#306998', // Darker Python blue
    size: 'xl',
    icon: (props) => (
      <Image
        src="/assets/python.svg"
        alt="Python"
        width={24}
        height={24}
        className={props.className}
      />
    ),
  },
  {
    name: 'Java',
    color: '#FFFFFF', // Slightly darker Java orange
    size: 'xl',
    icon: (props) => (
      <Image
        src="/assets/java.svg"
        alt="Java"
        width={24}
        height={24}
        className={props.className}
      />
    ),
  },
  {
    name: 'Golang',
    color: '#FFFFFF', // Darker Go blue
    size: 'md',
    icon: (props) => (
      <Image
        src="/assets/golang.svg"
        alt="Golang"
        width={24}
        height={24}
        className={props.className}
      />
    ),
  },
  {
    name: 'Zustand',
    color: '#E67E22', // Adjusted orange for better contrast
    size: 'lg',
    icon: (props) => (
      <Image
        src="/assets/zustand.png"
        alt="Zustand"
        width={24}
        height={24}
        className={props.className}
      />
    ),
  },
  {
    name: 'Docker',
    color: '#1D63ED', // Slightly darker Docker blue
    size: 'md',
    icon: (props) => (
      <Image
        src="/assets/docker.svg"
        alt="Docker"
        width={24}
        height={24}
        className={props.className}
      />
    ),
  },
  {
    name: 'PostgreSQL',
    color: '#2F5E8D', // Darker PostgreSQL blue
    size: 'lg',
    icon: (props) => (
      <Image
        src="/assets/pgsql.svg"
        alt="PostgreSQL"
        width={24}
        height={24}
        className={props.className}
      />
    ),
  },
  {
    name: 'MongoDB',
    color: '#023430', // Dark MongoDB green
    size: 'lg',
    icon: (props) => (
      <Image
        src="/assets/mongodb.svg"
        alt="MongoDB"
        width={24}
        height={24}
        className={props.className}
      />
    ),
  },
  {
    name: 'Tailwind',
    color: '#0F766E', // Darker Tailwind teal
    size: 'xl',
    icon: (props) => (
      <Image
        src="/assets/tailwindcss.png"
        alt="Tailwind"
        width={24}
        height={24}
        className={props.className}
      />
    ),
  },
  {
    name: 'Framer Motion',
    color: '#2e00a1', // Darker coral for Framer Motion
    size: 'lg',
    icon: (props) => (
      <Image
        src="/assets/framer.png"
        alt="Framer Motion"
        width={24}
        height={24}
        className={props.className}
      />
    ),
  },
];

const sizeClasses = {
  sm: 'h-12 w-12 md:h-14 md:w-14',
  md: 'h-14 w-14 md:h-16 md:w-16',
  lg: 'h-16 w-16 md:h-18 md:w-18',
  xl: 'h-18 w-18 md:h-20 md:w-20',
};

const About = () => {
  const [hasCopied, setHasCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(' youcanfindbenjamin@gmail.com');
    setHasCopied(true);

    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };

  return (
    <section className="c-space my-20" id="about">
      <div className="grid xl:grid-cols-3 xl:grid-rows-6 md:grid-cols-2 grid-cols-1 gap-5 h-full">
        <div className="col-span-1 xl:row-span-3">
          <div className="grid-container">
            <img
              src="assets/grid1.png"
              alt="grid-1"
              className="w-full sm:h-[276px] h-fit object-contain"
            />

            <div>
              <p className="grid-headtext">Hi, I&apos;m Benjamin</p>
              <p className="grid-subtext">
                As a full-stack developer, I combine frontend craftsmanship with
                backend expertise, focusing on integrating AI to build more
                intelligent and responsive web applications.
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-1 xl:row-span-3">
          <div className="grid-container">
            <img
              src="assets/grid2.png"
              alt="grid-2"
              className="w-full sm:h-[276px] h-fit object-contain"
            />

            <div>
              <p className="grid-headtext">Tech Stack</p>
              <p className="grid-subtext">
                I specialize in a variety of languages and frameworks, including
                React, Next.js, Node.js, and MongoDB. I am also have experience
                with machine learning and deep learning.
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-1 xl:row-span-4">
          <div className="grid-container">
            <div className="rounded-3xl w-full sm:h-[326px] h-fit flex justify-center items-center">
              <Globe
                height={386}
                width={386}
                backgroundColor="rgba(0, 0, 0, 0)"
                showAtmosphere
                showGraticules
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                labelsData={[
                  {
                    lat: 1.29027,
                    lng: 103.851959,
                    text: 'Singapore',
                    color: 'white',
                    size: 30,
                  },
                ]}
              />
            </div>
            <div>
              <p className="grid-headtext">
                I&apos;m very flexible with time zone communications & locations
              </p>
              <p className="grid-subtext">
                I&apos;m based in Singapore and open to remote work worldwide.
              </p>
              <Button name="Contact Me" isBeam containerClass="w-full mt-10" />
            </div>
          </div>
        </div>
        <div className="xl:col-span-2 xl:row-span-3">
          <div className="relative grid-container">
            {/* Add min-height for mobile and adjust height based on screen size */}
            <div className="relative min-h-[200px] sm:min-h-[300px]">
              <Gravity
                gravity={{ x: 0, y: 0.5 }}
                className="absolute inset-0"
                resetOnResize={true}
              >
                {skills.map((skill, index) => (
                  <MatterBody
                    key={index}
                    matterBodyOptions={{
                      friction: 0.3,
                      restitution: 0.7,
                      density: 0.8,
                    }}
                    x={`${10 + ((index * 20) % 80)}%`}
                    y={`${10 + Math.floor((index * 20) / 80) * 15}%`}
                    angle={Math.random() * 20 - 10}
                  >
                    <div
                      className={cn(
                        sizeClasses[
                          skill.size as 'lg' | 'sm' | 'md' | 'lg' | 'xl'
                        ],
                        'rounded-full hover:cursor-grab flex items-center justify-center',
                        'transform-gpu transition-transform hover:scale-110',
                        'shadow-lg hover:shadow-xl'
                      )}
                      style={{
                        backgroundColor: skill.color,
                        position: 'relative',
                      }}
                    >
                      {skill.icon({
                        className: 'w-2/3 h-2/3',
                        color:
                          skill.color === '#000000' ? '#FFFFFF' : '#000000',
                        strokeWidth: 1.5,
                      })}
                      <div className="opacity-0 hover:opacity-100 absolute inset-0 flex items-center justify-center rounded-full transition-opacity duration-200">
                        <span className="text-white text-xs font-medium">
                          {skill.name}
                        </span>
                      </div>
                    </div>
                  </MatterBody>
                ))}
              </Gravity>
            </div>

            <div className="mt-4 sm:mt-6">
              <p className="grid-headtext font-comic">My Tech Stack</p>
              <p className="grid-subtext">
                I am always learning and improving my skills to keep up with the
                latest technologies. I believe that code has the power to change
                the world and I am passionate about using my skills to make a
                positive impact.
              </p>
            </div>
          </div>
        </div>
        <div className="xl:col-span-1 xl:row-span-2">
          <div className="grid-container">
            <img
              src="assets/grid4.png"
              alt="grid-4"
              className="w-full md:h-[126px] sm:h-[276px] h-fit object-cover sm:object-top"
            />

            <div className="space-y-2">
              <p className="grid-subtext text-center">Contact me</p>
              <div className="copy-container" onClick={handleCopy}>
                <img
                  src={hasCopied ? 'assets/tick.svg' : 'assets/copy.svg'}
                  alt="copy"
                />
                <TextShimmer className="lg:text-lg md:text-md font-medium">
                  {exploreInfo.contact.mail}
                </TextShimmer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
