"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";

import { SectionCard } from "@/components/shared/section-card";
import { CONTACT_INFO } from "@/lib/constants/socials";
import { useAnimationSkipContext } from "@/lib/contexts/animation-skip-context";
import { useScrollReveal } from "@/lib/hooks/animation/use-scroll-reveal";
import { useShouldSkipEntranceAnimation } from "@/lib/hooks/animation/use-should-skip-entrance-animation";

const DynamicContactForm = dynamic(
  async () => {
    const mod = await import("@/components/forms/contact-form");
    return mod.ContactForm;
  },
  {
    loading: () => (
      <div className="min-h-72 rounded-xl border border-border/40 bg-card/50" />
    ),
    ssr: false,
  }
);

export const Contact = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { skipAnimations } = useAnimationSkipContext();
  const shouldSkipEntranceAnimation = useShouldSkipEntranceAnimation();
  useScrollReveal(containerRef, "div > *", {
    duration: 0.3,
    skipAnimations: shouldSkipEntranceAnimation || skipAnimations,
    stagger: 0.08,
    y: 15,
  });

  return (
    <SectionCard id="contact" title="Contact">
      <div className="flex flex-col gap-4" ref={containerRef}>
        <div>
          <p className="mb-2 max-w-md font-sans text-md text-muted-foreground">
            I&apos;m always up for a chat. Whether you have a project in mind,
            want to collaborate, or just want to say hi, feel free to drop me a
            message.
          </p>
          <p className="mb-8 text-muted-foreground/60 text-xs italic">
            * Your information is not stored. It is sent directly to my personal
            accounts.
          </p>

          <div className="flex items-center gap-4">
            {CONTACT_INFO.map((item) => (
              <a
                className="group relative inline-flex items-center justify-center"
                href={item.link}
                key={item.title}
                rel="noopener noreferrer"
                target="_blank"
              >
                <item.icon className="h-5 w-5 text-foreground transition-transform duration-100 group-hover:-translate-y-1 group-hover:scale-110" />
                <span className="sr-only">{item.title}</span>
              </a>
            ))}
          </div>
        </div>

        <DynamicContactForm />
      </div>
    </SectionCard>
  );
};
