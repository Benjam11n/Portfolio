'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useState } from 'react';

import { TextShimmer } from '@/components/ui/text-shimmer';
import { workExperiences } from '@/constants';

const Experience = () => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 10%', 'end 50%'],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <section className="c-space my-20" id="experience">
      <div className="w-full" ref={containerRef}>
        <div className="mx-auto max-w-7xl pt-20 font-comic">
          <h2 className="mb-4 max-w-4xl text-3xl md:text-5xl">My Professional Journey</h2>
          <p className="max-w-lg text-muted-foreground md:text-lg">
            Here&apos;s a timeline of my career progression and key achievements.
          </p>
        </div>

        <div ref={ref} className="relative mx-auto max-w-7xl pb-20 md:px-10">
          {workExperiences.map((experience) => (
            <div key={experience.id} className="flex justify-start pt-10 md:gap-10 md:pt-40">
              <div className="sticky top-40 z-40 flex max-w-xs flex-col items-center self-start md:w-full md:flex-row lg:max-w-sm">
                <div className="absolute left-3 flex size-10 items-center justify-center rounded-full md:left-3">
                  <div className="size-4 rounded-full border border-neutral-300 bg-neutral-200 p-2 dark:border-neutral-700 dark:bg-neutral-800" />
                </div>
                <div className="flex flex-col">
                  <h4 className="hidden font-comic text-lg font-bold text-muted-foreground md:block md:pl-20 md:text-lg">
                    {experience.duration}
                  </h4>
                  <h3 className="hidden font-comic text-lg font-bold md:block md:pl-20 md:text-4xl">
                    {experience.name}
                  </h3>
                </div>
              </div>

              <div className="relative w-full pl-20 pr-4 md:pl-4">
                <h3 className="mb-4 block text-left font-comic text-lg font-bold md:hidden">
                  {experience.name}
                </h3>
                <h4 className="mb-4 block text-left font-comic text-lg font-bold text-muted-foreground md:hidden">
                  {experience.duration}
                </h4>
                <div>
                  <TextShimmer
                    as="h4"
                    className="mb-4 text-xl font-semibold [--base-color:theme(colors.primary.DEFAULT)] [--base-gradient-color:theme(colors.primary.foreground)] md:text-xl"
                    duration={2.5}
                  >
                    {experience.pos}
                  </TextShimmer>

                  <p className="mb-8 text-base leading-relaxed text-muted-foreground">
                    {experience.title}
                  </p>

                  <div className="mt-12 grid grid-cols-2 gap-6">
                    <Image
                      src={experience.icon}
                      alt={`${experience.name} logo`}
                      width={500}
                      height={500}
                      className="h-20 w-full rounded-lg object-cover shadow-lg md:h-44 lg:h-60"
                    />
                    {experience.texture.endsWith('.mp4') ? (
                      <video
                        src={experience.texture}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="h-20 w-full rounded-lg object-cover shadow-lg md:h-44 lg:h-60"
                      />
                    ) : (
                      <Image
                        src={experience.texture}
                        alt={`${experience.name} texture`}
                        width={500}
                        height={500}
                        className="h-20 w-full rounded-lg object-cover shadow-lg md:h-44 lg:h-60"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div
            style={{ height: height + 'px' }}
            className="absolute left-8 top-0 w-[2px] overflow-hidden md:left-8"
          >
            <motion.div
              style={{
                height: heightTransform,
                opacity: opacityTransform,
              }}
              className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-purple-500 from-0% via-blue-500 via-10% to-transparent"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
