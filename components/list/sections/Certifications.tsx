'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { certifications } from '@/constants';
import { Card3D } from '@/components/list/Card3D';

interface SwipeInfo {
  offset: { x: number; y: number };
  velocity: { x: number; y: number };
}

const SWIPE = {
  OFFSET: 60, // minimum horizontal movement in pixels
  VELOCITY: 0.2, // minimum velocity
  POWER: 600, // combined metric threshold for consistent detection
};

const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * Math.abs(velocity);
};

// Card3D moved to '@/components/list/Card3D'

const Certifications = () => {
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
  const index = useMemo(() => {
    const len = certifications.length;
    const i = ((page % len) + len) % len;
    return i;
  }, [page]);
  const prefersReducedMotion = useReducedMotion();

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
      const offsetX = info.offset.x;
      const velocityX = info.velocity.x;
      const power = swipePower(offsetX, velocityX);
      const confidentSwipe =
        power > SWIPE.POWER ||
        (Math.abs(offsetX) > SWIPE.OFFSET && Math.abs(velocityX) > SWIPE.VELOCITY);
      if (confidentSwipe) {
        paginate(offsetX < 0 ? 1 : -1);
      }
    },
    [paginate],
  );

  const current = certifications[index];
  const total = certifications.length;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        paginate(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        paginate(1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        setPage([0, index > 0 ? -1 : 0]);
      } else if (e.key === 'End') {
        e.preventDefault();
        setPage([total - 1, index < total - 1 ? 1 : 0]);
      }
    },
    [paginate, index, total],
  );

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<(typeof certifications)[number] | null>(null);
  const openDetails = useCallback(() => {
    setSelectedCert(current);
    setDetailsOpen(true);
  }, [current]);
  const closeDetails = useCallback(() => {
    setDetailsOpen(false);
    setSelectedCert(null);
  }, []);

  return (
    <section
      className="c-space my-20"
      id="certifications"
      aria-roledescription="carousel"
      aria-labelledby="certifications-heading"
    >
      <h2 id="certifications-heading" className="mb-4 max-w-4xl font-comic text-3xl md:text-5xl">
        Certifications
      </h2>
      <p className="max-w-2xl text-muted-foreground md:text-lg">
        Swipe left or right to browse through my certifications.
      </p>
      {/* Live region for screen reader updates */}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        Showing {index + 1} of {total}: {current.name} — {current.organization}
      </p>

      <div className="relative mt-10 flex w-full items-center justify-center">
        {/* Left arrow */}
        <button
          type="button"
          aria-label="Previous certification"
          className="arrow-btn absolute left-2 z-10"
          onClick={() => paginate(-1)}
        >
          <Image src="/assets/left-arrow.png" alt="previous" width={16} height={16} />
        </button>

        {/* Card with swipe */}
        {/* Fixed-height stage to prevent layout shift and bottom jump */}
        <div className="relative h-[520px] w-full max-w-3xl md:h-[560px]" id="certifications-stage">
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={page}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={
                prefersReducedMotion
                  ? { type: 'tween', duration: 0.2, ease: 'easeOut' }
                  : { type: 'spring', stiffness: 260, damping: 30 }
              }
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 grid cursor-grab place-items-center active:cursor-grabbing"
              role="group"
              aria-roledescription="slide"
              aria-label={`${current.name} — ${current.organization}`}
              tabIndex={0}
              onKeyDown={handleKeyDown}
            >
              <Card3D
                name={current.name}
                organization={current.organization}
                date={current.date}
                image={current.image}
                description={current.description}
                onViewDetails={openDetails}
                detailsLabel="View Details"
                showDetailsButton
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right arrow */}
        <button
          type="button"
          aria-label="Next certification"
          className="arrow-btn absolute right-2 z-10"
          onClick={() => paginate(1)}
        >
          <Image src="/assets/right-arrow.png" alt="next" width={16} height={16} />
        </button>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {detailsOpen && selectedCert ? (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDetails}
              aria-hidden
            />
            {/* Dialog */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="cert-detail-title"
              className="fixed inset-0 z-50 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              tabIndex={-1}
              onKeyDown={(e) => {
                if (e.key === 'Escape') closeDetails();
              }}
            >
              <div className="w-[92%] max-w-xl overflow-hidden rounded-xl border bg-background shadow-xl">
                <div className="relative h-48 w-full">
                  <Image
                    src={selectedCert.image}
                    alt={selectedCert.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 id="cert-detail-title" className="font-comic text-xl md:text-2xl">
                    {selectedCert.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedCert.organization} • {selectedCert.date}
                  </p>
                  <p className="mt-3 text-foreground md:text-lg">{selectedCert.description}</p>
                </div>
                <div className="flex justify-end gap-3 p-5">
                  <Button
                    variant="secondary"
                    onClick={closeDetails}
                    aria-label="Close details"
                    type="button"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      {/* Index dots */}
      <div
        className="mt-6 flex items-center justify-center gap-2"
        role="tablist"
        aria-label="Certifications slides"
      >
        {certifications.map((item, i) => (
          <button
            key={i}
            type="button"
            className={`h-2 w-2 rounded-full ${i === index ? 'bg-primary' : 'bg-muted'}`}
            aria-label={`Go to slide ${i + 1}: ${item.name}`}
            aria-controls="certifications-stage"
            aria-current={i === index ? 'true' : undefined}
            onClick={() => setPage([i, i > index ? 1 : -1])}
          />
        ))}
      </div>
    </section>
  );
};

export default Certifications;
