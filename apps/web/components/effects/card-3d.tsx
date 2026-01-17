/** biome-ignore-all lint/a11y/noStaticElementInteractions: Interaction is hover-only */
"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

type Card3DProps = {
  children: React.ReactNode;
  thickness?: number;
  sideColor?: string;
  rotationIntensity?: number;
  parallaxIntensity?: number;
  glare?: boolean;
  glareIntensity?: number;
  shadow?: boolean;
  className?: string;
  containerClassName?: string;
};

export const Card3D = ({
  children,
  thickness = 12,
  sideColor,
  rotationIntensity = 15,
  parallaxIntensity = 0.1,
  glare = true,
  glareIntensity = 0.8,
  shadow = true,
  className,
  containerClassName,
}: Card3DProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const onMouseMove = useCallback(
    contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) {
        return;
      }

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -rotationIntensity;
      const rotateY = ((x - centerX) / centerX) * rotationIntensity;

      // Animate card rotation
      gsap.to(cardRef.current, {
        rotateX,
        rotateY,
        duration: 0.1,
        ease: "power2.out",
      });

      // Animate content parallax
      if (contentRef.current && parallaxIntensity > 0) {
        gsap.to(contentRef.current, {
          x: (x - centerX) * parallaxIntensity,
          y: (y - centerY) * parallaxIntensity,
          duration: 0.1,
        });
      }

      // Animate glare
      if (glareRef.current && glare) {
        gsap.to(glareRef.current, {
          x: x - rect.width / 2,
          y: y - rect.height / 2,
          opacity: glareIntensity,
          duration: 0.1,
          ease: "power2.out",
        });
      }
    }),
    []
  );

  const onMouseLeave = useCallback(
    contextSafe(() => {
      // Reset card rotation
      gsap.to(cardRef.current, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: "power2.out",
      });

      // Reset content parallax
      if (contentRef.current && parallaxIntensity > 0) {
        gsap.to(contentRef.current, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      }

      // Hide glare
      if (glareRef.current && glare) {
        gsap.to(glareRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      }
    }),
    []
  );

  const edgeColor = sideColor || "hsl(var(--muted))";
  const secondaryEdgeColor = sideColor || "hsl(var(--muted-foreground) / 0.3)";
  const halfThickness = thickness / 2;

  return (
    <div
      className={cn(
        "perspective-1000 relative h-full w-full",
        containerClassName
      )}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      ref={containerRef}
      role="presentation"
      style={{ perspective: 1000 }}
    >
      <div
        className={cn(
          "relative h-full w-full rounded-xl",
          shadow && "transition-shadow hover:shadow-xl"
        )}
        ref={cardRef}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className={cn(
            "relative h-full w-full overflow-hidden rounded-xl bg-card",
            className
          )}
          ref={faceRef}
          style={{
            transform: `translateZ(${halfThickness}px)`,
            backfaceVisibility: "hidden",
          }}
        >
          <div className="relative z-10 h-full" ref={contentRef}>
            {children}
          </div>

          {glare && (
            <div
              className="pointer-events-none absolute top-1/2 left-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(255,255,255,0.15)_0%,transparent_60%)] opacity-0 mix-blend-plus-lighter"
              ref={glareRef}
              style={{ transform: "translateZ(1px)" }}
            />
          )}
        </div>

        {/* Bottom Edge */}
        <div
          className="pointer-events-none absolute"
          style={{
            height: thickness,
            bottom: 0,
            left: thickness,
            right: thickness,
            background: `linear-gradient(to bottom, ${edgeColor}, ${secondaryEdgeColor})`,
            transform: "rotateX(90deg)",
            transformOrigin: "bottom center",
            backfaceVisibility: "hidden",
          }}
        />

        {/* Top Edge */}
        <div
          className="pointer-events-none absolute"
          style={{
            height: thickness,
            top: 0,
            left: thickness,
            right: thickness,
            background: `linear-gradient(to top, ${edgeColor}, ${secondaryEdgeColor})`,
            transform: "rotateX(-90deg)",
            transformOrigin: "top center",
            backfaceVisibility: "hidden",
          }}
        />

        {/* Right Edge */}
        <div
          className="pointer-events-none absolute top-0 h-full rounded-r-xl"
          style={{
            width: thickness,
            right: 0,
            background: `linear-gradient(to right, ${edgeColor}, ${secondaryEdgeColor})`,
            transform: "rotateY(-90deg)",
            transformOrigin: "right center",
            backfaceVisibility: "hidden",
          }}
        />

        {/* Left Edge (book spine) */}
        <div
          className="pointer-events-none absolute top-0 left-0 h-full rounded-l-xl"
          style={{
            width: thickness,
            background: `linear-gradient(to left, ${edgeColor}, ${secondaryEdgeColor})`,
            transform: "rotateY(90deg)",
            transformOrigin: "left center",
            backfaceVisibility: "hidden",
          }}
        />

        {/* Back Face */}
        <div
          className="pointer-events-none absolute top-0 left-0 h-full w-full rounded-xl bg-muted"
          style={{
            transform: `translateZ(${-halfThickness}px) rotateY(180deg)`,
            backfaceVisibility: "hidden",
          }}
        />
      </div>
    </div>
  );
};
