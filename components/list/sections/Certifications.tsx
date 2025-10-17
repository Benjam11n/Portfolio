'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';

import { certifications } from '@/constants';
import { Card3D } from '@/components/list/Card3D';

interface SwipeInfo {
  offset: { x: number; y: number };
  velocity: { x: number; y: number };
}

const swipeConfidenceThreshold = 800;

const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

// Card3D moved to '@/components/list/Card3D'

const Certifications = () => {
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
  const index = useMemo(() => {
    const len = certifications.length;
    const i = ((page % len) + len) % len;
    return i;
  }, [page]);

  const paginate = useCallback((newDirection: number) => {
    setPage(([p]) => [p + newDirection, newDirection]);
  }, []);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0, rotateY: dir > 0 ? -10 : 10 }),
    center: { x: 0, opacity: 1, rotateY: 0 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0, rotateY: dir > 0 ? 10 : -10 }),
  };

  const handleDragEnd = useCallback(
    (_: any, info: SwipeInfo) => {
      const power = swipePower(info.offset.x, info.velocity.x);
      if (power > swipeConfidenceThreshold) {
        paginate(info.offset.x < 0 ? 1 : -1);
      }
    },
    [paginate],
  );

  const current = certifications[index];

  return (
    <section className="c-space my-20" id="certifications">
      <h2 className="mb-4 max-w-4xl font-comic text-3xl md:text-5xl">Certifications</h2>
      <p className="max-w-2xl text-muted-foreground md:text-lg">
        Swipe left or right to browse through my certifications. Each card features a high-quality
        image, issuing organization, and a detailed description.
      </p>

      <div className="relative mt-10 flex w-full items-center justify-center">
        {/* Left arrow */}
        <button
          aria-label="Previous certification"
          className="arrow-btn absolute left-2 z-10"
          onClick={() => paginate(-1)}
        >
          <Image src="/assets/left-arrow.png" alt="previous" width={16} height={16} />
        </button>

        {/* Card with swipe */}
        {/* Fixed-height stage to prevent layout shift and bottom jump */}
        <div className="relative h-[520px] w-full max-w-3xl md:h-[560px]">
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={page}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 grid cursor-grab place-items-center active:cursor-grabbing"
            >
              <Card3D
                name={current.name}
                organization={current.organization}
                date={current.date}
                image={current.image}
                description={current.description}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right arrow */}
        <button
          aria-label="Next certification"
          className="arrow-btn absolute right-2 z-10"
          onClick={() => paginate(1)}
        >
          <Image src="/assets/right-arrow.png" alt="next" width={16} height={16} />
        </button>
      </div>

      {/* Index dots */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {certifications.map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full ${i === index ? 'bg-primary' : 'bg-muted'}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Certifications;
