import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { projectAtom } from './atoms';

import { exploreInfo } from '@/constants';
import { useMobile } from '@/hooks/use-mobile';


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
            className="flex max-w-[90vw] snap-x snap-mandatory flex-nowrap overflow-x-auto pb-4 md:grid md:max-w-[500px] md:grid-cols-[repeat(auto-fit,220px)] md:justify-center md:gap-4 md:overflow-x-visible"
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
                    {experience.description ? <p className="line-clamp-2 text-sm leading-relaxed">
                        {experience.description}
                      </p> : null}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* PROJECTS */}
        <section className="section section--left mobile--section--bottom" id="projects">
          <motion.div
            className="flex max-w-[90vw] snap-x snap-mandatory flex-nowrap overflow-x-auto pb-4 md:grid md:max-w-[500px] md:grid-cols-[repeat(auto-fit,220px)] md:justify-center md:gap-4 md:overflow-x-visible"
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
                        {project.description ? <p className="line-clamp-2 text-sm leading-relaxed">
                            {project.description}
                          </p> : null}
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
                        {project.description ? <p className="line-clamp-2 text-sm leading-relaxed">
                            {project.description}
                          </p> : null}
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
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
      <style jsx global>{`
        .interface .sections section motion div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
