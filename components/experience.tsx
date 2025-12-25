"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { SectionCard } from "@/components/section-card";
import { workExperiences } from "@/constants";

gsap.registerPlugin(ScrollTrigger);

export const Experience = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".experience-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none reverse",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <SectionCard
      className="scroll-mt-24 p-8 sm:p-12"
      id="experience"
      ref={containerRef}
      title="Experience"
    >
      <div className="flex flex-col gap-6">
        {workExperiences.map((item) => (
          <div
            className="experience-card group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:bg-secondary/50"
            key={item.id}
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary">
                  <img
                    alt={item.name}
                    className="h-8 w-8 object-contain"
                    src={item.icon}
                  />
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-lg leading-none transition-colors group-hover:text-primary">
                    {item.name}
                  </h3>
                  <p className="font-medium text-muted-foreground text-sm">
                    {item.pos}
                  </p>
                </div>
              </div>
              <span className="self-start rounded-full bg-secondary/50 px-3 py-1 font-mono text-muted-foreground text-sm">
                {item.duration}
              </span>
            </div>
            <div className="mt-4 pl-16 max-sm:pl-0">
              <p className="line-clamp-3 text-muted-foreground text-sm leading-relaxed transition-all duration-300 group-hover:line-clamp-none">
                {item.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};
