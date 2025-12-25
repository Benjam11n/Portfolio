"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { SectionCard } from "@/components/section-card";
import { certifications } from "@/constants";

gsap.registerPlugin(ScrollTrigger);

export const Certifications = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".cert-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom-=100",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <SectionCard
      className="scroll-mt-24 p-6 sm:p-8"
      id="certifications"
      ref={containerRef}
      title="Certifications"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((cert) => (
          <div
            className="cert-card group relative rounded-xl border border-border bg-card p-6 transition-all hover:bg-secondary/50"
            key={cert.name}
          >
            <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg bg-secondary">
              {/* Placeholder for actual certificate image if available, using project images as placeholders from constants for now as per data */}
              <Image
                alt={cert.name}
                className="object-cover opacity-80 transition-opacity group-hover:opacity-100"
                fill
                src={cert.image}
              />
            </div>
            <h3 className="mb-1 font-semibold transition-colors group-hover:text-primary">
              {cert.name}
            </h3>
            <p className="mb-4 text-muted-foreground text-sm">
              {cert.organization}
            </p>
            <p className="line-clamp-3 text-muted-foreground/80 text-xs">
              {cert.description}
            </p>
            <span className="absolute top-6 right-6 rounded border border-border bg-background/80 px-2 py-1 font-mono text-xs backdrop-blur">
              {cert.date}
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};
