"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";
import type { Certification } from "@/constants";

type CertificationCardProps = {
  cert: Certification;
};

export const CertificationCard = ({ cert }: CertificationCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const onMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    if (!(cardRef.current && glareRef.current)) {
      return;
    }

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
    const rotateY = ((x - centerX) / centerX) * 10;

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      duration: 0.5,
      ease: "power2.out",
    });

    gsap.to(glareRef.current, {
      x: x - rect.width / 2,
      y: y - rect.height / 2,
      opacity: 0.6, // Visible when moving
      duration: 0.5,
      ease: "power2.out",
    });
  });

  const onMouseLeave = contextSafe(() => {
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
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
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      className="perspective-1000 relative h-full w-full"
      onMouseEnter={() => {
        // Ensure glare is reset or ready
      }}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      ref={containerRef}
      style={{ perspective: 1000 }}
    >
      <div
        className="relative h-full w-full overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-xl"
        ref={cardRef}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Content */}
        <div className="pointer-events-none relative z-10">
          <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg bg-secondary">
            <Image
              alt={cert.name}
              className="object-cover transition-opacity hover:opacity-100"
              fill
              src={cert.image}
            />
          </div>
          <h3 className="mb-1 font-semibold text-foreground">{cert.name}</h3>
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

        {/* Glare Effect */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_60%)] opacity-0 mix-blend-plus-lighter"
          ref={glareRef}
        />
      </div>
    </div>
  );
};
