'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { Gravity, MatterBody } from '@/components/ui/gravity';
import { TextShimmer } from '@/components/ui/text-shimmer';
import { EMAIL, exploreInfo } from '@/constants';
import { cn } from '@/lib/utils';

import Button from '../Button';

interface Skill {
  name: string;
  color: string;
  size: 'sm' | 'md' | 'lg' | 'xl';
  icon: (props: { className: string }) => JSX.Element;
}

const skills: Skill[] = [
  {
    name: 'React',
    color: '#001b59',
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
    color: '#3178C6',
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
    color: '#FFFFFF',
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
    color: '#215732',
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
    color: '#306998',
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
    color: '#FFFFFF',
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
    color: '#FFFFFF',
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
    color: '#E67E22',
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
    color: '#1D63ED',
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
    color: '#2F5E8D',
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
    color: '#023430',
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
    color: '#0F766E',
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
    name: 'Supabase',
    color: '#525252',
    size: 'lg',
    icon: (props) => (
      <Image
        src="/assets/supabase.svg"
        alt="Framer Motion"
        width={24}
        height={24}
        className={props.className}
      />
    ),
  },
  {
    name: 'Framer Motion',
    color: '#2e00a1',
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
  sm: 'h-10 w-10 lg:h-14 lg:w-14',
  md: 'h-12 w-12 lg:h-16 lg:w-16',
  lg: 'h-14 w-14 lg:h-20 lg:w-20',
  xl: 'h-16 w-16 lg:h-24 lg:w-24',
};

const Globe = dynamic(
  () => import('react-globe.gl').then((mod) => mod.default),
  { ssr: false }
);

const About = () => {
  const [hasCopied, setHasCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(EMAIL);
    setHasCopied(true);

    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };

  return (
    <section className="c-space my-20" id="about">
      <div className="grid h-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 xl:grid-rows-6">
        <div className="col-span-1 xl:row-span-3">
          <div className="grid-container">
            <Image
              src="/assets/grid1.png"
              alt="grid-1"
              width={500}
              height={276}
              className="h-fit w-full object-contain sm:h-[276px]"
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
            <Image
              src="/assets/grid2.png"
              alt="grid-2"
              width={500}
              height={276}
              className="h-fit w-full object-contain sm:h-[276px]"
            />

            <div>
              <p className="grid-headtext">What I'm Currently Learning</p>
              <p className="grid-subtext">
                I'm always expanding my skill set and exploring new
                technologies. Right now, I'm diving deep into AI-powered
                applications, and 3D web experiences with Three.js.
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-1 xl:row-span-4">
          <div className="grid-container">
            <div className="flex h-fit w-full items-center justify-center rounded-3xl sm:h-[326px]">
              {isClient ? (
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
                      size: 40,
                    },
                  ]}
                />
              ) : (
                <div className="flex size-[386px] items-center justify-center rounded-full bg-slate-800">
                  <p className="text-center text-lg">Loading globe...</p>
                </div>
              )}
            </div>
            <div>
              <p className="grid-headtext">
                I&apos;m very flexible with time zone communications & locations
              </p>
              <p className="grid-subtext">
                I&apos;m based in Singapore and open to remote work worldwide.
                Feel free to reach out—let's build something great together!
              </p>
              <Button name="Contact Me" isBeam containerClass="w-full mt-10" />
            </div>
          </div>
        </div>
        <div className="xl:col-span-2 xl:row-span-3">
          <div className="grid-container relative">
            <div className="relative min-h-[200px] sm:min-h-[300px]">
              {isClient && (
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
                        })}
                        <div className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 transition-opacity duration-200 hover:opacity-100">
                          <span className="text-xs font-medium text-white">
                            {skill.name}
                          </span>
                        </div>
                      </div>
                    </MatterBody>
                  ))}
                </Gravity>
              )}
            </div>

            <div className="mt-4 sm:mt-6">
              <p className="grid-headtext font-comic">My Tech Stack</p>
              <p className="grid-subtext">
                I am always learning and improving my skills to keep up with the
                latest technologies.
              </p>
            </div>
          </div>
        </div>
        <div className="xl:col-span-1 xl:row-span-2">
          <div className="grid-container">
            <Image
              src="/assets/grid4.png"
              alt="grid-4"
              width={500}
              height={276}
              className="object-cover sm:object-top md:h-[126px]"
            />

            <div className="space-y-2">
              <p className="grid-subtext text-center">Contact me</p>
              <div className="copy-container" onClick={handleCopy}>
                <Image
                  src={hasCopied ? '/assets/tick.svg' : '/assets/copy.svg'}
                  alt="copy"
                  width={24}
                  height={24}
                />
                <TextShimmer className="font-medium lg:text-lg">
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
