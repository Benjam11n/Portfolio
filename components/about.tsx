"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";
import { SectionCard } from "@/components/section-card";
import { ShiftButton } from "./shift-button";

export const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "power3.out" },
      });

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const { isDesktop } = context.conditions as {
            isDesktop: boolean;
          };
          const offset = isDesktop ? -220 : -40;

          // Images popup
          tl.from(".about-image", {
            scale: 0,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "back.out(1.5)",
          });

          // Text stagger
          tl.from(
            ".about-text",
            {
              y: 30,
              opacity: 0,
              duration: 0.8,
              stagger: 0.1,
            },
            "-=0.4"
          );

          // Button pop
          tl.fromTo(
            ".about-button",
            {
              scale: 0,
              opacity: 0,
              x: offset,
              duration: 0.6,
              ease: "back.out(1.5)",
            },
            {
              scale: 1,
              opacity: 1,
              x: 0,
              duration: 0.6,
              ease: "back.out(1.5)",
            },
            "-=0.4"
          );
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <SectionCard id="about" title="About Me">
      {/* Content Wrapper */}
      <div className="flex flex-col gap-4" ref={containerRef}>
        {/* Images Stack */}
        <div className="relative mx-auto mb-4 h-24 w-28 sm:mx-0 sm:h-36 sm:w-36">
          {/* Image 1 (Back) */}
          <div className="about-image absolute top-0 left-0 h-20 w-20 rotate-[-6deg] overflow-hidden rounded-xl border border-border bg-secondary shadow-lg sm:h-32 sm:w-32">
            <Image
              alt="Profile Background"
              className="object-cover opacity-60 grayscale"
              fill
              src="/projects/project1.png"
            />
          </div>

          {/* Image 2 (Front) */}
          <div className="about-image absolute top-4 left-8 z-10 h-20 w-20 rotate-[3deg] overflow-hidden rounded-xl border-4 border-card bg-card shadow-xl sm:left-12 sm:h-32 sm:w-32">
            <Image
              alt="Profile Foreground"
              className="object-cover"
              fill
              src="/projects/project2.png"
            />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-6 text-foreground text-md leading-relaxed">
          <p className="about-text">
            I&apos;m Benjamin Wang, a passionate full-stack developer and AI
            enthusiast who bridges creativity with technology. Currently
            exploring new ways to craft meaningful digital experiences, I&apos;m
            driven by curiosity and a love for clean, purposeful design.
          </p>
          <p className="about-text">
            I thrive on transforming ideas into reality — whether it&apos;s
            shaping intuitive interfaces, building robust backend systems, or
            training models that solve real-world problems.
          </p>
        </div>

        <div className="about-button">
          <ShiftButton href="#contact" variant="primary">
            Get in Touch
          </ShiftButton>
        </div>
      </div>
    </SectionCard>
  );
};
