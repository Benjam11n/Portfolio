'use client';

import { SectionCard } from '@/components/nue/SectionCard';
import Link from 'next/link';

export const About = () => {
  return (
    <SectionCard id="about" title="About Me" className="p-8 sm:p-12 scroll-mt-24">

        {/* Content Wrapper */}
        <div className="flex flex-col gap-8">
            {/* Images Stack */}
            <div className="relative h-48 w-48 mx-auto sm:mx-0 mb-4">
                {/* Image 1 (Back) */}
                <div className="absolute top-0 left-0 w-32 h-40 bg-secondary rounded-2xl rotate-[-6deg] shadow-lg border border-border overflow-hidden">
                    <img src="/projects/project1.png" alt="Profile Background" className="w-full h-full object-cover opacity-60 grayscale" />
                </div>
                {/* Image 2 (Front) */}
                <div className="absolute top-4 left-12 w-32 h-40 bg-card rounded-2xl rotate-[3deg] shadow-xl border-4 border-card z-10 overflow-hidden">
                     <img src="/projects/project2.png" alt="Profile Foreground" className="w-full h-full object-cover" />
                </div>
            </div>

            {/* Text */}
            <div className="space-y-6 text-foreground font-medium text-lg leading-relaxed">
                <p>
                    I&apos;m Benjamin Wang, a passionate full-stack developer and AI enthusiast who bridges creativity with technology. Currently exploring new ways to craft meaningful digital experiences, I&apos;m driven by curiosity and a love for clean, purposeful design.
                </p>
                <p>
                    I thrive on transforming ideas into reality — whether it&apos;s shaping intuitive interfaces, building robust backend systems, or training models that solve real-world problems.
                </p>
            </div>

            {/* Button */}
            <div>
                <Link href="#contact" className="inline-flex px-8 py-3 bg-foreground text-background rounded-full text-sm font-bold hover:opacity-90 transition-opacity shadow-lg">
                    Get in Touch
                </Link>
            </div>
        </div>
    </SectionCard>
  );
};
