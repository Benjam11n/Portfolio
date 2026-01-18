/** biome-ignore-all lint/a11y/noStaticElementInteractions: Interaction is hover-only */
"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

// Variant preset configurations for common 3D card styles
const CARD_VARIANTS = {
  subtle: {
    rotationIntensity: 5,
    thickness: 8,
    glare: false,
    parallaxIntensity: 0.05,
  },
  standard: {
    rotationIntensity: 15,
    thickness: 12,
    glare: true,
    parallaxIntensity: 0.1,
  },
  dramatic: {
    rotationIntensity: 25,
    thickness: 16,
    glare: true,
    parallaxIntensity: 0.15,
  },
  book: {
    rotationIntensity: 12,
    thickness: 20,
    glare: true,
    parallaxIntensity: 0.08,
  },
} as const;

type Card3DVariant = keyof typeof CARD_VARIANTS;

type Card3DProps = {
  children: React.ReactNode;

  // Variant preset for common configurations
  variant?: Card3DVariant; // Optional: 'subtle' | 'standard' | 'dramatic' | 'book'

  // Thickness/depth configuration
  thickness?: number; // Default: 12 (px) - book-like depth
  sideColor?: string; // Default: uses CSS variable

  // 3D behavior
  rotationIntensity?: number; // Default: 15 (degrees max rotation)
  parallaxIntensity?: number; // Default: 0.1 (content parallax multiplier)

  // Visual options
  glare?: boolean; // Default: true
  glareIntensity?: number; // Default: 0.8
  shadow?: boolean; // Default: true

  // Styling
  className?: string; // Applied to the card face
  containerClassName?: string; // Applied to the perspective container
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
  const faceRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Merge variant defaults with explicit props
  // Variant defaults are applied first, then explicit props override them
  const variantDefaults = variant ? CARD_VARIANTS[variant] : {};
  const mergedThickness = thickness ?? variantDefaults.thickness ?? 12;
  const mergedRotationIntensity = rotationIntensity ?? variantDefaults.rotationIntensity ?? 15;
  const mergedParallaxIntensity = parallaxIntensity ?? variantDefaults.parallaxIntensity ?? 0.1;
  const mergedGlare = glare ?? variantDefaults.glare ?? true;

  const { contextSafe } = useGSAP({ scope: containerRef });

  const onMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    // Skip tilt animation if user prefers reduced motion
    if (prefersReducedMotion) {
      return;
    }

    if (!cardRef.current) {
      return;
    }

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -mergedRotationIntensity;
    const rotateY = ((x - centerX) / centerX) * mergedRotationIntensity;

    // Animate card rotation
    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      duration: 0.1,
      ease: "power2.out",
    });

    // Animate content parallax
    if (contentRef.current && mergedParallaxIntensity > 0) {
      gsap.to(contentRef.current, {
        x: (x - centerX) * mergedParallaxIntensity,
        y: (y - centerY) * mergedParallaxIntensity,
        duration: 0.1,
      });
    }

    // Animate glare
    if (glareRef.current && mergedGlare) {
      gsap.to(glareRef.current, {
        x: x - rect.width / 2,
        y: y - rect.height / 2,
        opacity: glareIntensity,
        duration: 0.1,
        ease: "power2.out",
      });
    }
  });

  const onMouseLeave = contextSafe(() => {
    // Skip reset animation if user prefers reduced motion
    if (prefersReducedMotion) {
      return;
    }

    // Reset card rotation
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: "power2.out",
    });

    // Reset content parallax
    if (contentRef.current && mergedParallaxIntensity > 0) {
      gsap.to(contentRef.current, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    }

    // Hide glare
    if (glareRef.current && mergedGlare) {
      gsap.to(glareRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  });

  // Edge colors - solid colors for book spine effect
  const primaryEdgeColor = sideColor || "hsl(var(--muted))";
  const secondaryEdgeColor = sideColor || "hsl(var(--muted-foreground) / 0.3)";

  // Half thickness for positioning from center
  const halfThickness = mergedThickness / 2;

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
      {/* 3D Card Container - this is what rotates */}
      <div
        className={cn(
          "relative h-full w-full rounded-xl",
          // Only animate shadow if user does not prefer reduced motion
          shadow &&
            !prefersReducedMotion &&
            "transition-shadow hover:shadow-xl",
          // Show shadow statically if reduced motion is preferred
          shadow && prefersReducedMotion && "shadow-xl"
        )}
        ref={cardRef}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Card Face (Front) - positioned forward */}
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
          {/* Content with parallax */}
          <div className="relative z-10 h-full" ref={contentRef}>
            {children}
          </div>

          {/* Glare Effect */}
          {mergedGlare && (
            <div
              className="pointer-events-none absolute top-1/2 left-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(255,255,255,0.15)_0%,transparent_60%)] opacity-0 mix-blend-plus-lighter"
              ref={glareRef}
              style={{ transform: "translateZ(1px)" }}
            />
          )}
        </div>

        {/* 
          Book Edges - These create the "spine" effect
          Each edge is a rectangle that's rotated 90deg and positioned at the card boundary
        */}

        {/* Bottom Edge (shows when card tilts backward) - inset to avoid corners */}
        <div
          className="pointer-events-none absolute"
          style={{
            height: mergedThickness,
            bottom: 0,
            left: mergedThickness,
            right: mergedThickness,
            background: `linear-gradient(to bottom, ${primaryEdgeColor}, ${secondaryEdgeColor})`,
            transform: "rotateX(90deg)",
            transformOrigin: "bottom center",
            backfaceVisibility: "hidden",
          }}
        />

        {/* Top Edge (shows when card tilts forward) - inset to avoid corners */}
        <div
          className="pointer-events-none absolute"
          style={{
            height: mergedThickness,
            top: 0,
            left: mergedThickness,
            right: mergedThickness,
            background: `linear-gradient(to top, ${primaryEdgeColor}, ${secondaryEdgeColor})`,
            transform: "rotateX(-90deg)",
            transformOrigin: "top center",
            backfaceVisibility: "hidden",
          }}
        />

        {/* Right Edge (shows when card tilts left) */}
        <div
          className="pointer-events-none absolute top-0 h-full rounded-r-xl"
          style={{
            width: mergedThickness,
            right: 0,
            background: `linear-gradient(to right, ${primaryEdgeColor}, ${secondaryEdgeColor})`,
            transform: "rotateY(-90deg)",
            transformOrigin: "right center",
            backfaceVisibility: "hidden",
          }}
        />

        {/* Left Edge (shows when card tilts right) - like a book spine */}
        <div
          className="pointer-events-none absolute top-0 left-0 h-full rounded-l-xl"
          style={{
            width: mergedThickness,
            background: `linear-gradient(to left, ${primaryEdgeColor}, ${secondaryEdgeColor})`,
            transform: "rotateY(90deg)",
            transformOrigin: "left center",
            backfaceVisibility: "hidden",
          }}
        />

        {/* Back Face - hidden from front view */}
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
