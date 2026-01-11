/** biome-ignore-all lint/a11y/noNoninteractiveElementInteractions: Interaction is hover-only */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: Interaction is hover-only */
"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef, useState } from "react";
import type { Certification } from "@/lib/types";

type CertificationCardProps = {
  cert: Certification;
};

export const CertificationCard = ({ cert }: CertificationCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);
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

    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;

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
        className="relative h-full w-full overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-xl"
        ref={cardRef}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Content with parallax */}
        <div
          className="pointer-events-none relative z-10"
          ref={contentRef}
          style={{ transform: "translateZ(50px)" }} // Add depth
        >
          <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg bg-secondary shadow-inner">
            {imageError ? (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">
                Image not available
              </div>
            ) : (
              <Image
                alt={cert.name}
                className="object-cover transition-opacity hover:opacity-100"
                fill
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                src={cert.image}
              />
            )}
          </div>
          <h3 className="translate-z-10 mb-1 font-semibold text-foreground">
            {cert.name}
          </h3>
          <p className="translate-z-8 mb-4 text-muted-foreground text-sm">
            {cert.organization}
          </p>
          <p className="translate-z-6 line-clamp-3 text-muted-foreground/80 text-xs">
            {cert.description}
          </p>
          <span className="translate-z-12 absolute top-6 right-6 rounded border border-border bg-background/80 px-2 py-1 font-mono text-xs backdrop-blur">
            {cert.date}
          </span>
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
