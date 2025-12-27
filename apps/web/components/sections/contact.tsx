"use client";

import { useRef } from "react";
import { ContactForm } from "@/components/forms/contact-form";
import { SectionCard } from "@/components/shared/section-card";
import { CONTACT_INFO } from "@/constants/socials";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export const Contact = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useScrollReveal(containerRef, "div > *", {
    duration: 0.4,
    stagger: 0.08,
    y: 15,
  });

  return (
    <SectionCard id="contact" title="Contact">
      <div className="flex flex-col gap-4" ref={containerRef}>
        <div>
          <p className="mb-8 max-w-md font-sans text-md text-muted-foreground">
            I&apos;m always open to new projects, collaborations, or a
            conversation about design. If you have an idea in mind or want to
            connect, feel free to get in touch.
          </p>

          <div className="flex items-center gap-4">
            {CONTACT_INFO.map((item) => (
              <a
                className="group relative transition-transform hover:scale-110"
                href={item.link}
                key={item.title}
                rel="noopener noreferrer"
                target="_blank"
              >
                <item.icon className="h-5 w-5 text-foreground transition-colors duration-300" />
                <span className="sr-only">{item.title}</span>
              </a>
            ))}
          </div>
        </div>

        <ContactForm />
      </div>
    </SectionCard>
  );
};
