/** biome-ignore-all lint/a11y/noStaticElementInteractions: Interaction is hover-only */
"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

// Variant preset configurations for common 3D card styles
const CARD_VARIANTS = {
  subtle: {
    rotationIntensity: 3,
    thickness: 8,
    glare: false,
    parallaxIntensity: 0.02,
  },
  standard: {
    rotationIntensity: 8,
    thickness: 12,
    glare: true,
    parallaxIntensity: 0.05,
  },
  dramatic: {
    rotationIntensity: 15,
    thickness: 16,
    glare: true,
    parallaxIntensity: 0.1,
  },
  book: {
    rotationIntensity: 8,
    thickness: 20,
    glare: true,
    parallaxIntensity: 0.04,
  },
} as const;

type Card3DVariant = keyof typeof CARD_VARIANTS;

export type Card3DProps = {
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
};

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

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      duration: 0.3,
      ease: "power2.out",
    });

    if (contentRef.current && mergedParallaxIntensity > 0) {
      gsap.to(contentRef.current, {
        x: normalizedX * (rect.width * mergedParallaxIntensity),
        y: normalizedY * (rect.height * mergedParallaxIntensity),
        duration: 0.3,
        ease: "power2.out",
      });
    }

    if (glareRef.current && mergedGlare) {
      gsap.to(glareRef.current, {
        x: (normalizedX * rect.width) / -1.5,
        y: (normalizedY * rect.height) / -1.5,
        opacity: glareIntensity,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  });

  const handleMouseLeave = contextSafe(() => {
    if (prefersReducedMotion || !cardRef.current) {
      return;
    }

    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: "power2.out",
      overwrite: true,
    });

    if (contentRef.current && mergedParallaxIntensity > 0) {
      gsap.to(contentRef.current, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        overwrite: true,
      });
    }

    if (glareRef.current && mergedGlare) {
      gsap.to(glareRef.current, {
        opacity: 0,
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        overwrite: true,
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
            transform: `translateZ(${halfThickness}px)`,
            backfaceVisibility: "hidden",
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
            height: mergedThickness,
            left: halfThickness,
            right: halfThickness,
            background: `linear-gradient(to bottom, ${primaryEdgeColor}, ${secondaryEdgeColor})`,
            transform: `translateY(${halfThickness}px) rotateX(-90deg)`,
            backfaceVisibility: "hidden",
          }}
        />

        <div
          className="pointer-events-none absolute top-0"
          style={{
            height: mergedThickness,
            left: halfThickness,
            right: halfThickness,
            background: `linear-gradient(to top, ${primaryEdgeColor}, ${secondaryEdgeColor})`,
            transform: `translateY(-${halfThickness}px) rotateX(90deg)`,
            backfaceVisibility: "hidden",
          }}
        />

        <div
          className="pointer-events-none absolute top-0 right-0 h-full rounded-r-xl"
          style={{
            width: mergedThickness,
            background: `linear-gradient(to right, ${primaryEdgeColor}, ${secondaryEdgeColor})`,
            transform: `translateX(${halfThickness}px) rotateY(90deg)`,
            backfaceVisibility: "hidden",
          }}
        />

        <div
          className="pointer-events-none absolute top-0 left-0 h-full rounded-l-xl"
          style={{
            width: mergedThickness,
            background: `linear-gradient(to left, ${primaryEdgeColor}, ${secondaryEdgeColor})`,
            transform: `translateX(-${halfThickness}px) rotateY(-90deg)`,
            backfaceVisibility: "hidden",
          }}
        />

        <div
          className="pointer-events-none absolute top-0 left-0 h-full w-full rounded-xl bg-muted"
          style={{
            transform: `translateZ(-${halfThickness}px) rotateY(180deg)`,
            backfaceVisibility: "hidden",
          }}
        />
      </div>
    </div>
  );
};
