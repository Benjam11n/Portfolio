"use client";

import Image from "next/image";
import { SectionCard } from "@/components/section-card";
import { ShiftButton } from "./ui/shift-button";

export const About = () => {
  return (
    <SectionCard id="about" title="About Me">
      {/* Content Wrapper */}
      <div className="flex flex-col gap-4">
        {/* Images Stack */}
        <div className="relative mx-auto mb-4 h-36 w-36 sm:mx-0">
          {/* Image 1 (Back) */}
          <div className="absolute top-0 left-0 h-32 w-32 rotate-[-6deg] overflow-hidden rounded-2xl border border-border bg-secondary shadow-lg">
            <Image
              alt="Profile Background"
              className="object-cover opacity-60 grayscale"
              fill
              src="/projects/project1.png"
            />
          </div>

          {/* Image 2 (Front) */}
          <div className="absolute top-4 left-12 z-10 h-32 w-32 rotate-[3deg] overflow-hidden rounded-2xl border-4 border-card bg-card shadow-xl">
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
          <p>
            I&apos;m Benjamin Wang, a passionate full-stack developer and AI
            enthusiast who bridges creativity with technology. Currently
            exploring new ways to craft meaningful digital experiences, I&apos;m
            driven by curiosity and a love for clean, purposeful design.
          </p>
          <p>
            I thrive on transforming ideas into reality — whether it&apos;s
            shaping intuitive interfaces, building robust backend systems, or
            training models that solve real-world problems.
          </p>
        </div>

        <div>
          <ShiftButton href="#contact" variant="primary">
            Get in Touch
          </ShiftButton>
        </div>
      </div>
    </SectionCard>
  );
};
