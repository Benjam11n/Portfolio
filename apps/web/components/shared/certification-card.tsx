/** biome-ignore-all lint/a11y/noNoninteractiveElementInteractions: Interaction is hover-only */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: Interaction is hover-only */
"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";
import type { Certification } from "@/types";

type CertificationCardProps = {
  cert: Certification;
};

export const CertificationCard = ({ cert }: CertificationCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const onMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    if (!(cardRef.current && glareRef.current && contentRef.current)) {
      return;
    }

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -20;
    const rotateY = ((x - centerX) / centerX) * 20;

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      duration: 0.1,
      ease: "power2.out",
    });

    gsap.to(contentRef.current, {
      x: (x - centerX) * 0.1,
      y: (y - centerY) * 0.1,
      duration: 0.1,
    });

    gsap.to(glareRef.current, {
      x: x - rect.width / 2,
      y: y - rect.height / 2,
      opacity: 0.8,
      duration: 0.1,
      ease: "power2.out",
    });
  });

  const onMouseLeave = contextSafe(() => {
    gsap.to([cardRef.current, contentRef.current], {
      rotateX: 0,
      rotateY: 0,
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
    });

    gsap.to(glareRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  });

  return (
    <div
      className="perspective-1000 relative h-full w-full"
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      ref={containerRef}
      style={{ perspective: 1000 }}
    >
      <div
        className="relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-border/40 bg-card p-5 shadow-sm transition-all hover:border-border/80 hover:shadow-md"
        ref={cardRef}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Date Badge */}
        <span className="translate-z-12 absolute top-4 right-4 z-20 rounded-full border border-border/40 bg-background/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground uppercase tracking-wider backdrop-blur-md">
          {cert.date}
        </span>

        {/* Content with parallax */}
        <div
          className="pointer-events-none relative z-10 flex flex-col"
          ref={contentRef}
          style={{ transform: "translateZ(50px)" }} // Add depth
        >
          <div className="relative mb-5 aspect-[16/10] w-full overflow-hidden rounded-lg bg-muted shadow-sm">
            <Image
              alt={cert.name}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              fill
              src={cert.image}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="translate-z-10 font-bold text-foreground text-md leading-snug tracking-tight">
              {cert.name}
            </h3>
            <p className="translate-z-8 font-medium text-muted-foreground text-sm uppercase tracking-wide">
              {cert.organization}
            </p>
            <p className="translate-z-6 mt-1 line-clamp-3 text-muted-foreground/90 text-sm leading-relaxed">
              {cert.description}
            </p>
          </div>
        </div>

        {/* Glare Effect */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(255,255,255,0.15)_0%,transparent_60%)] opacity-0 mix-blend-plus-lighter"
          ref={glareRef}
          style={{ transform: "translateZ(1px)" }}
        />
      </div>
    </div>
  );
};
