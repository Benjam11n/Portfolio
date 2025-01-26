'use client';

import { useState } from 'react';
import Globe from 'react-globe.gl';
import Button from '../Button';
import { exploreInfo } from '@/constants';
import { Gravity, MatterBody } from '@/components/ui/gravity';
import { cn } from '@/lib/utils';
import { TextShimmer } from '@/components/ui/text-shimmer';

const skills = [
  { name: 'React', color: '#61DAFB', size: 'lg' },
  { name: 'TypeScript', color: '#3178C6', size: 'xl' },
  { name: 'Next.js', color: '#000000', size: 'lg' },
  { name: 'Node.js', color: '#339933', size: 'xl' },
  { name: 'Python', color: '#3776AB', size: 'lg' },
  { name: 'GraphQL', color: '#E10098', size: 'md' },
  { name: 'Docker', color: '#2496ED', size: 'lg' },
  { name: 'AWS', color: '#FF9900', size: 'xl' },
  { name: 'PostgreSQL', color: '#336791', size: 'lg' },
  { name: 'MongoDB', color: '#47A248', size: 'md' },
  { name: 'Redis', color: '#DC382D', size: 'lg' },
  { name: 'Tailwind', color: '#38B2AC', size: 'xl' },
];

const sizeClasses = {
  sm: 'text-sm md:text-base',
  md: 'text-base md:text-lg',
  lg: 'text-lg md:text-xl',
  xl: 'text-xl md:text-2xl',
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
                gravity={{ x: 0, y: 1 }}
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
                    // Adjust positioning for better mobile layout
                    x={`${10 + ((index * 20) % 80)}%`}
                    y={`${10 + Math.floor((index * 20) / 80) * 15}%`}
                    angle={Math.random() * 20 - 10}
                  >
                    <div
                      className={cn(
                        sizeClasses[skill.size as keyof typeof sizeClasses],
                        'rounded-full hover:cursor-grab px-4 py-2 sm:px-6 sm:py-3 whitespace-nowrap',
                        'transform-gpu' // Add hardware acceleration
                      )}
                      style={{ backgroundColor: skill.color }}
                    >
                      {skill.name}
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
