/** biome-ignore-all lint/a11y/noNoninteractiveElementInteractions: Interaction is hover-only */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: Interaction is hover-only */
"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { BorderedImage } from "@/components/bordered-image";
import type { STACKS } from "@/constants";

export const TechStackItem = ({ stack }: { stack: (typeof STACKS)[0] }) => {
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

    const rotateX = ((y - centerY) / centerY) * -20;
    const rotateY = ((x - centerX) / centerX) * 20;

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      duration: 0.1,
      ease: "power2.out",
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
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: "power2.out",
    });

    if (glareRef.current) {
      gsap.to(glareRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  });

  return (
    <div
      className="tech-item perspective-1000 relative h-full w-full"
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      ref={containerRef}
      style={{ perspective: 1000 }}
    >
      <div
        className="group relative flex h-full items-center gap-4 overflow-hidden rounded-2xl border border-border/60 border-dashed bg-card p-3 shadow-sm hover:border-border/80"
        ref={cardRef}
        style={{ transformStyle: "preserve-3d" }}
      >
        <BorderedImage
          alt={stack.name}
          colorDark={stack.colorDark}
          colorLight={stack.colorLight}
          containerClassName="h-14 w-14 shrink-0"
          height={32}
          imageClassName="p-3 object-contain"
          src={stack.icon}
          width={32}
        />
        <div className="flex flex-col">
          <span className="font-semibold text-foreground text-md">
            {stack.name}
          </span>
          <span className="font-medium text-muted-foreground text-sm">
            {stack.category}
          </span>
        </div>

        {/* Glare Effect */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_60%)] opacity-0 mix-blend-plus-lighter"
          ref={glareRef}
          style={{ transform: "translateZ(1px)" }}
        />
      </div>
    </div>
  );
};
