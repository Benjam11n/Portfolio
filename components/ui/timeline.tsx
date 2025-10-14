'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

interface TimelineEntry {
  title: string;
  subtitle: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
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
    <div className="w-full md:px-10" ref={containerRef}>
      <div className="mx-auto max-w-7xl px-4 pt-20 font-comic md:px-8 lg:px-10">
        <h2 className="mb-4 max-w-4xl text-3xl md:text-5xl">My Professional Journey</h2>
        <p className="max-w-sm text-muted-foreground md:text-lg">
          Here&apos;s a timeline of my career progression and key achievements.
        </p>
      </div>

      <div ref={ref} className="relative mx-auto max-w-7xl pb-20">
        {data.map((item, index) => (
          <div key={index} className="flex justify-start pt-10 md:gap-10 md:pt-40">
            <div className="sticky top-40 z-40 flex max-w-xs flex-col items-center self-start md:w-full md:flex-row lg:max-w-sm">
              <div className="absolute left-3 flex size-10 items-center justify-center rounded-full md:left-3">
                <div className="size-4 rounded-full border border-neutral-300 bg-neutral-200 p-2 dark:border-neutral-700 dark:bg-neutral-800" />
              </div>
              <div className="flex flex-col">
                <h4 className="hidden font-comic text-lg font-bold text-muted-foreground md:block md:pl-20 md:text-lg">
                  {item.subtitle}
                </h4>
                <h3 className="hidden font-comic text-lg font-bold md:block md:pl-20 md:text-5xl">
                  {item.title}
                </h3>
              </div>
            </div>

            <div className="relative w-full pl-20 pr-4 md:pl-4">
              <h3 className="mb-4 block text-left font-comic text-lg font-bold md:hidden">
                {item.title}
              </h3>
              <h4 className="mb-4 block text-left font-comic text-lg font-bold text-muted-foreground md:hidden">
                {item.subtitle}
              </h4>
              {item.content}{' '}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + 'px',
          }}
          className="absolute left-8 top-0 w-[2px] overflow-hidden bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-0% via-neutral-200 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] md:left-8 dark:via-neutral-700"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-rose-500 from-0% via-orange-500 via-10% to-transparent"
          />
        </div>
      </div>
    </div>
  );
};
