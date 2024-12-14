import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { atom, useAtom } from 'jotai';
import { useState } from 'react';

import { config } from '../../constants/config';
import { useMobile } from '../../hooks/useMobile';

export const projectAtom = atom(config.projects[0]);

export const Interface = () => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollData = useScroll();
  const [_project, setProject] = useAtom(projectAtom);
  const { isMobile } = useMobile();

  useFrame(() => {
    setHasScrolled(scrollData.offset > 0);
  });

  return (
    <div className="interface">
      <div className="sections">
        {/* HOME */}
        <section className="section section--bottom">
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
        <section className="section"></section>

        {/* EXPERIENCE */}
        <section className="section section--right mobile--section--bottom">
          <motion.div
            className="projects"
            whileInView={'visible'}
            initial={{ opacity: 0 }}
            variants={{ visible: { opacity: 1 } }}
            viewport={{ margin: isMobile ? '-70% 0px 0px 0px' : undefined }}
          >
            {config.projects.map((project, idx) => {
              return (
                <motion.div
                  className="project"
                  key={project.name}
                  initial={{ opacity: 0 }}
                  onMouseEnter={() => setProject(project)}
                  variants={{ visible: { opacity: 1 } }}
                  transition={{ duration: 1, delay: isMobile ? 0 : idx * 0.5 }}
                >
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      className="project__image"
                      src={project.image}
                      alt={project.name}
                    />
                    <div className="project__details">
                      <h2 className="project__details__name">{project.name}</h2>
                      {project.description && (
                        <p className="project__details__description">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </a>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* PROJECTS */}
        <section className="section section--left mobile--section--bottom">
          <motion.div
            className="projects"
            whileInView={'visible'}
            initial={{ opacity: 0 }}
            variants={{ visible: { opacity: 1 } }}
            viewport={{ margin: isMobile ? '-70% 0px 0px 0px' : undefined }}
          >
            {config.projects.map((project, idx) => {
              return (
                <motion.div
                  className="project"
                  key={project.name}
                  initial={{ opacity: 0 }}
                  onMouseEnter={() => setProject(project)}
                  variants={{ visible: { opacity: 1 } }}
                  transition={{ duration: 1, delay: isMobile ? 0 : idx * 0.5 }}
                >
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      className="project__image"
                      src={project.image}
                      alt={project.name}
                    />
                    <div className="project__details">
                      <h2 className="project__details__name">{project.name}</h2>
                      {project.description && (
                        <p className="project__details__description">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </a>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* CONTACT */}
        <section className="section section--left mobile--section--bottom">
          <motion.div
            className="contact"
            whileInView={'visible'}
            initial={{ opacity: 0 }}
            variants={{ visible: { opacity: 1 } }}
          >
            <h1 className="contact__name">{config.contact.name}</h1>
            <p className="contact__address">{config.contact.address}</p>
            <div className="contact__socials">
              <a
                href={config.contact.socials.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  className="contact__socials__icon invert"
                  src="/assets/linkedin.svg"
                  alt="linkedin"
                />
              </a>
              <a
                href={config.contact.socials.github}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  className="contact__socials__icon"
                  src="/assets/twitter.svg"
                  alt="twitter"
                />
              </a>
              <a
                href={config.contact.socials.github}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  className="contact__socials__icon"
                  src="/assets/github.svg"
                  alt="github"
                />
              </a>
              <a
                href={`mailto:${config.contact.mail}`}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  className="contact__socials__icon invert"
                  src="/assets/email.svg"
                  alt="email"
                />
              </a>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};
