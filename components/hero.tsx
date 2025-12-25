"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { SectionCard } from "@/components/section-card";

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".hero-text",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2 }
      );

      tl.fromTo(
        ".hero-subtext",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: -0.5 }
      );
    },
    { scope: containerRef }
  );

  return (
    <SectionCard
      className="scroll-mt-24 p-6 sm:p-8"
      ref={containerRef}
    >
      <h1 className="hero-text mb-6 font-bold text-4xl text-primary tracking-tight sm:text-6xl">
        Benjamin Wang
      </h1>
      <h2 className="hero-text mb-8 font-medium text-muted-foreground text-xl sm:text-2xl">
        Full Stack Developer &<br className="sm:hidden" /> AI Enthusiast
      </h2>
      <p className="hero-subtext max-w-lg text-lg text-muted-foreground leading-relaxed">
        I build accessible, pixel-perfect, performant web experiences. Currently
        exploring the intersection of web development and artificial
        intelligence.
      </p>
    </SectionCard>
  );
};
