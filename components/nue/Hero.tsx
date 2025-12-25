'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.hero-text',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2 }
      );
      
      tl.fromTo(
        '.hero-subtext',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: -0.5 }
      );
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="py-24 sm:py-32 px-6 sm:px-12 flex flex-col justify-center min-h-[50vh] bg-muted/30 rounded-3xl border border-border/40 mb-8 mt-8 sm:mt-12">
      <h1 className="hero-text text-4xl sm:text-6xl font-bold tracking-tight text-primary mb-6">
        Benjamin Wang
      </h1>
      <h2 className="hero-text text-xl sm:text-2xl text-muted-foreground font-medium mb-8">
        Full Stack Developer &<br className="sm:hidden" /> AI Enthusiast
      </h2>
      <p className="hero-subtext text-lg text-muted-foreground max-w-lg leading-relaxed">
        I build accessible, pixel-perfect, performant web experiences. 
        Currently exploring the intersection of web development and artificial intelligence.
      </p>
    </section>
  );
};
