import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { exploreInfo } from '../../constants';
import { useMobile } from '../../hooks/useMobile';
import { projectAtom } from './atoms';

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
            className="experiences"
            whileInView={'visible'}
            initial={{ opacity: 0 }}
            variants={{ visible: { opacity: 1 } }}
            viewport={{ margin: isMobile ? '-70% 0px 0px 0px' : undefined }}
          >
            {exploreInfo.experiences.map((experience, idx) => {
              return (
                <motion.div
                  className="experience"
                  key={experience.name}
                  initial={{ opacity: 0 }}
                  onMouseEnter={() => setProject(experience)}
                  variants={{ visible: { opacity: 1 } }}
                  transition={{ duration: 1, delay: isMobile ? 0 : idx * 0.5 }}
                >
                  {/* <a
                    href={experience.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  > */}
                  <img
                    className="project__image"
                    src={experience.image}
                    alt={experience.name}
                  />
                  <div className="project__details">
                    <h2 className="project__details__name">
                      {experience.name}
                    </h2>
                    {experience.description && (
                      <p className="project__details__description">
                        {experience.description}
                      </p>
                    )}
                  </div>
                  {/* </a> */}
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
            {exploreInfo.projects.map((project, idx) => {
              return (
                <motion.div
                  className="project"
                  key={project.name}
                  initial={{ opacity: 0 }}
                  onMouseEnter={() => setProject(project)}
                  variants={{ visible: { opacity: 1 } }}
                  transition={{ duration: 1, delay: isMobile ? 0 : idx * 0.5 }}
                >
                  {project.link ? (
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
                        <h2 className="project__details__name">
                          {project.name}
                        </h2>
                        {project.description && (
                          <p className="project__details__description">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </a>
                  ) : (
                    <>
                      <img
                        className="project__image"
                        src={project.image}
                        alt={project.name}
                      />
                      <div className="project__details">
                        <h2 className="project__details__name">
                          {project.name}
                        </h2>
                        {project.description && (
                          <p className="project__details__description">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </>
                  )}
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
            <h1 className="contact__name">{exploreInfo.contact.name}</h1>
            <p className="contact__address">{exploreInfo.contact.address}</p>
            <div className="contact__socials">
              <a
                href={exploreInfo.contact.socials.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  className="contact__socials__icon invert"
                  src="/assets/linkedin.svg"
                  alt="linkedin"
                />
              </a>
              {/* <a
                href={exploreInfo.contact.socials.github}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  className="contact__socials__icon"
                  src="/assets/twitter.svg"
                  alt="twitter"
                />
              </a> */}
              <a
                href={exploreInfo.contact.socials.github}
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
                href={`mailto:${exploreInfo.contact.mail}`}
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
