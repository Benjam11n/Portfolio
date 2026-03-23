"use client";

import { useGSAP } from "@gsap/react";
import gsapCore from "gsap";
import { useRef } from "react";

import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

// Variant preset configurations for common 3D card styles
const CARD_VARIANTS = {
  book: {
    glare: true,
    parallaxIntensity: 0.04,
    rotationIntensity: 8,
    thickness: 20,
  },
  dramatic: {
    glare: true,
    parallaxIntensity: 0.1,
    rotationIntensity: 15,
    thickness: 16,
  },
  standard: {
    glare: true,
    parallaxIntensity: 0.05,
    rotationIntensity: 8,
    thickness: 12,
  },
  subtle: {
    glare: false,
    parallaxIntensity: 0.02,
    rotationIntensity: 3,
    thickness: 8,
  },
} as const;

type Card3DVariant = keyof typeof CARD_VARIANTS;

export interface Card3DProps {
  children: React.ReactNode;

  // Variant preset for common configurations
  variant?: Card3DVariant;

  // Thickness/depth configuration
  thickness?: number;
  sideColor?: string;

  // 3D behavior
  rotationIntensity?: number;
  parallaxIntensity?: number;

  // Visual options
  glare?: boolean;
  glareIntensity?: number;
  shadow?: boolean;

  // Styling
  className?: string;
  containerClassName?: string;
}

export const Card3D = ({
  children,
  variant,
  thickness,
  sideColor,
  rotationIntensity,
  parallaxIntensity,
  glare,
  glareIntensity = 0.8,
  shadow = true,
  className,
  containerClassName,
}: Card3DProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Merge variant defaults with explicit props
  const variantDefaults = (variant ? CARD_VARIANTS[variant] : {}) as Partial<
    (typeof CARD_VARIANTS)[Card3DVariant]
  >;
  const mergedThickness = thickness ?? variantDefaults.thickness ?? 12;
  const mergedRotationIntensity =
    rotationIntensity ?? variantDefaults.rotationIntensity ?? 8;
  const mergedParallaxIntensity =
    parallaxIntensity ?? variantDefaults.parallaxIntensity ?? 0.05;
  const mergedGlare = glare ?? variantDefaults.glare ?? true;

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !containerRef.current || !cardRef.current) {
      return;
    }

    // Use container rect instead of transforming card rect to avoid jitter loop
    const rect = containerRef.current.getBoundingClientRect();

    // Calculate cursor position relative to the container's center
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Normalize values between -1 and 1
    const normalizedX = (x - centerX) / centerX;
    const normalizedY = (y - centerY) / centerY;

    const rotateX = normalizedY * -mergedRotationIntensity;
    const rotateY = normalizedX * mergedRotationIntensity;

    gsapCore.to(cardRef.current, {
      duration: 0.3,
      ease: "power2.out",
      rotateX,
      rotateY,
    });

    if (contentRef.current && mergedParallaxIntensity > 0) {
      gsapCore.to(contentRef.current, {
        duration: 0.3,
        ease: "power2.out",
        x: normalizedX * (rect.width * mergedParallaxIntensity),
        y: normalizedY * (rect.height * mergedParallaxIntensity),
      });
    }

    if (glareRef.current && mergedGlare) {
      gsapCore.to(glareRef.current, {
        duration: 0.3,
        ease: "power2.out",
        opacity: glareIntensity,
        x: (normalizedX * rect.width) / -1.5,
        y: (normalizedY * rect.height) / -1.5,
      });
    }
  });

  const handleMouseLeave = contextSafe(() => {
    if (prefersReducedMotion || !cardRef.current) {
      return;
    }

    gsapCore.to(cardRef.current, {
      duration: 0.5,
      ease: "power2.out",
      overwrite: true,
      rotateX: 0,
      rotateY: 0,
    });

    if (contentRef.current && mergedParallaxIntensity > 0) {
      gsapCore.to(contentRef.current, {
        duration: 0.5,
        ease: "power2.out",
        overwrite: true,
        x: 0,
        y: 0,
      });
    }

    if (glareRef.current && mergedGlare) {
      gsapCore.to(glareRef.current, {
        duration: 0.5,
        ease: "power2.out",
        opacity: 0,
        overwrite: true,
        x: 0,
        y: 0,
      });
    }
  });

  const primaryEdgeColor = sideColor || "hsl(var(--muted))";
  const secondaryEdgeColor = sideColor || "hsl(var(--muted-foreground) / 0.3)";
  const halfThickness = mergedThickness / 2;

  return (
    <div
      className={cn("relative h-full w-full", containerClassName)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={containerRef}
      role="presentation"
      style={{ perspective: 1000 }}
    >
      <div
        className={cn(
          "relative h-full w-full rounded-xl transition-shadow",
          shadow && !prefersReducedMotion && "hover:shadow-2xl",
          shadow && prefersReducedMotion && "shadow-xl"
        )}
        ref={cardRef}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className={cn(
            "relative h-full w-full overflow-hidden rounded-xl bg-card",
            className
          )}
          style={{
            backfaceVisibility: "hidden",
            transform: `translateZ(${halfThickness}px)`,
            transformStyle: "preserve-3d",
          }}
        >
          <div className="relative z-10 h-full w-full" ref={contentRef}>
            {children}
          </div>

          {mergedGlare && (
            <div
              className="pointer-events-none absolute top-1/2 left-1/2 h-[250%] w-[250%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,transparent_50%)] opacity-0 mix-blend-plus-lighter"
              ref={glareRef}
              style={{ transform: "translateZ(1px)" }}
            />
          )}
        </div>

        <div
          className="pointer-events-none absolute bottom-0"
          style={{
            backfaceVisibility: "hidden",
            background: `linear-gradient(to bottom, ${primaryEdgeColor}, ${secondaryEdgeColor})`,
            height: mergedThickness,
            left: halfThickness,
            right: halfThickness,
            transform: `translateY(${halfThickness}px) rotateX(-90deg)`,
          }}
        />

        <div
          className="pointer-events-none absolute top-0"
          style={{
            backfaceVisibility: "hidden",
            background: `linear-gradient(to top, ${primaryEdgeColor}, ${secondaryEdgeColor})`,
            height: mergedThickness,
            left: halfThickness,
            right: halfThickness,
            transform: `translateY(-${halfThickness}px) rotateX(90deg)`,
          }}
        />

        <div
          className="pointer-events-none absolute top-0 right-0 h-full rounded-r-xl"
          style={{
            backfaceVisibility: "hidden",
            background: `linear-gradient(to right, ${primaryEdgeColor}, ${secondaryEdgeColor})`,
            transform: `translateX(${halfThickness}px) rotateY(90deg)`,
            width: mergedThickness,
          }}
        />

        <div
          className="pointer-events-none absolute top-0 left-0 h-full rounded-l-xl"
          style={{
            backfaceVisibility: "hidden",
            background: `linear-gradient(to left, ${primaryEdgeColor}, ${secondaryEdgeColor})`,
            transform: `translateX(-${halfThickness}px) rotateY(-90deg)`,
            width: mergedThickness,
          }}
        />

        <div
          className="pointer-events-none absolute top-0 left-0 h-full w-full rounded-xl bg-muted"
          style={{
            backfaceVisibility: "hidden",
            transform: `translateZ(-${halfThickness}px) rotateY(180deg)`,
          }}
        />
      </div>
    </div>
  );
};
