import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useAtom } from 'jotai';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';

import { projectAtom } from './atoms';

import { certifications, exploreInfo } from '@/constants';
import { useMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Card3D } from '@/components/list/Card3D';

interface SwipeInfo {
  offset: { x: number; y: number };
  velocity: { x: number; y: number };
}

const SWIPE = {
  OFFSET: 60,
  VELOCITY: 0.2,
  POWER: 600,
};

export const Interface = () => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollData = useScroll();
  const [, setProject] = useAtom(projectAtom);
  const { isMobile } = useMobile();

  useFrame(() => {
    setHasScrolled(scrollData.offset > 0);
  });

  return (
    <div className="interface">
      <div className="sections">
        {/* HOME */}
        <section className="section section--bottom" id="home">
          <motion.div
            className="scroll-down"
            initial={{ opacity: 0 }}
            animate={{ opacity: hasScrolled ? 0 : 1 }}
          >
            <motion.div
              className="scroll-down__wheel"
              initial={{ translateY: 0 }}
              animate={{ translateY: 4 }}
              transition={{
                duration: 0.4,
                repeatDelay: 0.5,
                repeatType: 'reverse',
                repeat: Infinity,
              }}
            ></motion.div>
          </motion.div>
        </section>

        {/* ABOUT */}
        <section className="section" id="about"></section>

        {/* EXPERIENCE */}
        <section className="section section--right mobile--section--bottom" id="experience">
          <motion.div
            className="hide-scrollbar flex max-w-[90vw] snap-x snap-mandatory flex-nowrap overflow-x-auto pb-4 md:grid md:max-w-[500px] md:grid-cols-[repeat(auto-fit,220px)] md:justify-center md:gap-4 md:overflow-x-visible"
            style={{
              scrollbarWidth: 'none', // Firefox
              msOverflowStyle: 'none', // IE/Edge
            }}
            whileInView={'visible'}
            initial={{ opacity: 0 }}
            variants={{ visible: { opacity: 1 } }}
            viewport={{ margin: isMobile ? '-70% 0px 0px 0px' : undefined }}
          >
            {exploreInfo.experiences.map((experience, idx) => {
              return (
                <motion.div
                  className="mr-4 w-[180px] min-w-[180px] shrink-0 snap-center overflow-hidden rounded-xl border border-white/10 bg-white/10 shadow-lg backdrop-blur-lg transition-all duration-300 ease-in-out hover:scale-105 hover:border-white/20 hover:bg-white/20 hover:shadow-xl md:mr-0 md:w-auto"
                  key={experience.name}
                  initial={{ opacity: 0 }}
                  onMouseEnter={() => setProject(experience)}
                  variants={{ visible: { opacity: 1 } }}
                  transition={{ duration: 1, delay: isMobile ? 0 : idx * 0.5 }}
                >
                  <div className="relative h-28 w-full">
                    <Image
                      className="object-cover"
                      src={experience.image}
                      alt={experience.name}
                      fill
                      sizes="(max-width: 768px) 180px, 220px"
                      priority={idx < 2}
                    />
                  </div>
                  <div className="space-y-2 p-4">
                    <h2 className="text-lg font-semibold tracking-tight">{experience.name}</h2>
                    {experience.description ? (
                      <p className="line-clamp-2 text-sm leading-relaxed">
                        {experience.description}
                      </p>
                    ) : null}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* PROJECTS */}
        <section className="section section--left mobile--section--bottom" id="projects">
          <motion.div
            className="hide-scrollbar flex max-w-[90vw] snap-x snap-mandatory flex-nowrap overflow-x-auto pb-4 md:grid md:max-w-[500px] md:grid-cols-[repeat(auto-fit,220px)] md:justify-center md:gap-4 md:overflow-x-visible"
            style={{
              scrollbarWidth: 'none', // Firefox
              msOverflowStyle: 'none', // IE/Edge
            }}
            whileInView={'visible'}
            initial={{ opacity: 0 }}
            variants={{ visible: { opacity: 1 } }}
            viewport={{ margin: isMobile ? '-70% 0px 0px 0px' : undefined }}
          >
            {exploreInfo.projects.map((project, idx) => {
              return (
                <motion.div
                  className="mr-4 w-[180px] min-w-[180px] shrink-0 snap-center overflow-hidden rounded-xl border border-white/10 bg-white/10 shadow-lg backdrop-blur-lg transition-all duration-300 ease-in-out hover:scale-105 hover:border-white/20 hover:bg-white/20 hover:shadow-xl md:mr-0 md:w-auto"
                  key={project.name}
                  initial={{ opacity: 0 }}
                  onMouseEnter={() => setProject(project)}
                  variants={{ visible: { opacity: 1 } }}
                  transition={{ duration: 1, delay: isMobile ? 0 : idx * 0.5 }}
                >
                  {project.link ? (
                    <Link
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="relative h-28 w-full">
                        <Image
                          className="object-cover"
                          src={project.image}
                          alt={project.name}
                          fill
                          sizes="(max-width: 768px) 180px, 220px"
                          priority={idx < 2}
                        />
                      </div>
                      <div className="space-y-2 p-4">
                        <h2 className="text-lg font-semibold tracking-tight">{project.name}</h2>
                        {project.description ? (
                          <p className="line-clamp-2 text-sm leading-relaxed">
                            {project.description}
                          </p>
                        ) : null}
                      </div>
                    </Link>
                  ) : (
                    <>
                      <div className="relative h-28 w-full">
                        <Image
                          className="object-cover"
                          src={project.image}
                          alt={project.name}
                          fill
                          sizes="(max-width: 768px) 180px, 220px"
                          priority={idx < 2}
                        />
                      </div>
                      <div className="space-y-2 p-4">
                        <h2 className="text-lg font-semibold tracking-tight">{project.name}</h2>
                        {project.description ? (
                          <p className="line-clamp-2 text-sm leading-relaxed">
                            {project.description}
                          </p>
                        ) : null}
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* CERTIFICATIONS */}
        <section className="section section--right mobile--section--bottom" id="certifications">
          <CertificationsSection />
        </section>

        {/* CONTACT */}
        <section className="section section--left mobile--section--bottom" id="contact">
          <motion.div
            className="contact"
            whileInView={'visible'}
            initial={{ opacity: 0 }}
            variants={{ visible: { opacity: 1 } }}
          >
            <h1 className="contact__name">{exploreInfo.contact.name}</h1>
            <p className="contact__address">{exploreInfo.contact.address}</p>
            <div className="contact__socials">
              <Link
                href={exploreInfo.contact.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <div className="relative size-6">
                  <Image
                    className="contact__socials__icon invert"
                    src="/assets/linkedin.svg"
                    alt="linkedin"
                    fill
                  />
                </div>
              </Link>
              <Link
                href={exploreInfo.contact.socials.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <div className="relative size-6">
                  <Image
                    className="contact__socials__icon"
                    src="/assets/github.svg"
                    alt="github"
                    fill
                  />
                </div>
              </Link>
              <Link
                href={`mailto:${exploreInfo.contact.mail}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Email"
              >
                <div className="relative size-6">
                  <Image
                    className="contact__socials__icon invert"
                    src="/assets/email.svg"
                    alt="email"
                    fill
                  />
                </div>
              </Link>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Add custom CSS to hide scrollbars in WebKit browsers */}
      {/* eslint-disable react/no-unknown-property */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

const CertificationsSection = () => {
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
  } as const;

  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * Math.abs(velocity);
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
      className="c-space my-6 md:my-10"
      aria-roledescription="carousel"
      aria-labelledby="certifications-heading"
    >
      <h2 id="certifications-heading" className="mb-4 max-w-4xl font-comic text-2xl md:text-4xl">
        Certifications
      </h2>
      <p className="max-w-2xl text-muted-foreground md:text-lg">
        Swipe left or right to browse through my certifications.
      </p>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        Showing {index + 1} of {total}: {current.name} — {current.organization}
      </p>

      <div className="relative mt-6 flex w-full items-center justify-center md:mt-10">
        <button
          type="button"
          aria-label="Previous certification"
          className="arrow-btn absolute left-2 z-10"
          onClick={() => paginate(-1)}
        >
          <Image src="/assets/left-arrow.png" alt="previous" width={16} height={16} />
        </button>

        <div className="relative h-[420px] w-full max-w-3xl md:h-[560px]" id="certifications-stage">
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
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') {
                  e.preventDefault();
                  paginate(-1);
                } else if (e.key === 'ArrowRight') {
                  e.preventDefault();
                  paginate(1);
                }
              }}
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

        <button
          type="button"
          aria-label="Next certification"
          className="arrow-btn absolute right-2 z-10"
          onClick={() => paginate(1)}
        >
          <Image src="/assets/right-arrow.png" alt="next" width={16} height={16} />
        </button>
      </div>

      <AnimatePresence>
        {detailsOpen && selectedCert ? (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDetails}
              aria-hidden
            />
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
            aria-selected={i === index ? 'true' : undefined}
            onClick={() => setPage([i, i > index ? 1 : -1])}
          />
        ))}
      </div>
    </section>
  );
};
