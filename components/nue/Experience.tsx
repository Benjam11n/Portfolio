'use client';

import { workExperiences } from '@/constants';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

export const Experience = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        '.experience-card',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse',
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section id="experience" ref={containerRef} className="py-24 scroll-mt-16">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-2xl font-semibold tracking-tight">Experience</h2>
        <div className="h-px bg-border flex-1" />
      </div>

      <div className="flex flex-col gap-6">
        {workExperiences.map((item) => (
          <div
            key={item.id}
            className="experience-card group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:bg-secondary/50"
          >
            <div className="flex flex-col sm:flex-row gap-4 sm:items-start justify-between">
              <div className="flex gap-4">
                <div className="bg-secondary rounded-lg w-12 h-12 flex items-center justify-center shrink-0 border border-border">
                  <img src={item.icon} alt={item.name} className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold leading-none mb-2 group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground">{item.pos}</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground font-mono bg-secondary/50 px-3 py-1 rounded-full self-start">
                {item.duration}
              </span>
            </div>
            <div className="mt-4 pl-16 max-sm:pl-0">
               <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                  {item.title}
               </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
