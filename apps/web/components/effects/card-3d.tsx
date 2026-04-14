"use client";

import { useGSAP } from "@gsap/react";
import gsapCore from "gsap";
import { useRef } from "react";

import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";
import { useMobileDetection } from "@/lib/hooks/utils/use-mobile-detection";
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

interface Card3DProps {
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

const getCardSettings = ({
  glare,
  parallaxIntensity,
  rotationIntensity,
  thickness,
  variant,
}: Pick<
  Card3DProps,
  "glare" | "parallaxIntensity" | "rotationIntensity" | "thickness" | "variant"
>) => {
  const defaults = variant ? CARD_VARIANTS[variant] : undefined;

  return {
    glare: glare ?? defaults?.glare ?? true,
    parallaxIntensity: parallaxIntensity ?? defaults?.parallaxIntensity ?? 0.05,
    rotationIntensity: rotationIntensity ?? defaults?.rotationIntensity ?? 8,
    thickness: thickness ?? defaults?.thickness ?? 12,
  };
};

const StaticCard = ({
  children,
  className,
  containerClassName,
  shadow,
}: Pick<
  Card3DProps,
  "children" | "className" | "containerClassName" | "shadow"
>) => (
  <div className={cn("relative h-full w-full", containerClassName)}>
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-xl bg-card",
        shadow && "shadow-xl",
        className
      )}
    >
      {children}
    </div>
  </div>
);

const animateParallax = ({
  content,
  height,
  intensity,
  normalizedX,
  normalizedY,
  width,
}: {
  content: HTMLDivElement | null;
  intensity: number;
  normalizedX: number;
  normalizedY: number;
  width: number;
  height: number;
}) => {
  if (!(content && intensity > 0)) {
    return;
  }

  gsapCore.to(content, {
    duration: 0.3,
    ease: "power2.out",
    x: normalizedX * (width * intensity),
    y: normalizedY * (height * intensity),
  });
};

const animateGlare = ({
  glare,
  glareEnabled,
  glareIntensity,
  normalizedX,
  normalizedY,
  width,
  height,
}: {
  glare: HTMLDivElement | null;
  glareEnabled: boolean;
  glareIntensity: number;
  normalizedX: number;
  normalizedY: number;
  width: number;
  height: number;
}) => {
  if (!(glare && glareEnabled)) {
    return;
  }

  gsapCore.to(glare, {
    duration: 0.3,
    ease: "power2.out",
    opacity: glareIntensity,
    x: (normalizedX * width) / -1.5,
    y: (normalizedY * height) / -1.5,
  });
};

const resetParallax = (content: HTMLDivElement | null, intensity: number) => {
  if (!(content && intensity > 0)) {
    return;
  }

  gsapCore.to(content, {
    duration: 0.5,
    ease: "power2.out",
    overwrite: true,
    x: 0,
    y: 0,
  });
};

const resetGlare = (glare: HTMLDivElement | null, glareEnabled: boolean) => {
  if (!(glare && glareEnabled)) {
    return;
  }

  gsapCore.to(glare, {
    duration: 0.5,
    ease: "power2.out",
    opacity: 0,
    overwrite: true,
    x: 0,
    y: 0,
  });
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
  const isMobile = useMobileDetection();
  const shouldDisable3D = prefersReducedMotion || isMobile;
  const {
    glare: mergedGlare,
    parallaxIntensity: mergedParallaxIntensity,
    rotationIntensity: mergedRotationIntensity,
    thickness: mergedThickness,
  } = getCardSettings({
    glare,
    parallaxIntensity,
    rotationIntensity,
    thickness,
    variant,
  });

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldDisable3D || !containerRef.current || !cardRef.current) {
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

    animateParallax({
      content: contentRef.current,
      height: rect.height,
      intensity: mergedParallaxIntensity,
      normalizedX,
      normalizedY,
      width: rect.width,
    });
    animateGlare({
      glare: glareRef.current,
      glareEnabled: mergedGlare,
      glareIntensity,
      height: rect.height,
      normalizedX,
      normalizedY,
      width: rect.width,
    });
  });

  const handleMouseLeave = contextSafe(() => {
    if (shouldDisable3D || !cardRef.current) {
      return;
    }

    gsapCore.to(cardRef.current, {
      duration: 0.5,
      ease: "power2.out",
      overwrite: true,
      rotateX: 0,
      rotateY: 0,
    });

    resetParallax(contentRef.current, mergedParallaxIntensity);
    resetGlare(glareRef.current, mergedGlare);
  });

  const primaryEdgeColor = sideColor || "hsl(var(--muted))";
  const secondaryEdgeColor = sideColor || "hsl(var(--muted-foreground) / 0.3)";
  const halfThickness = mergedThickness / 2;

  if (shouldDisable3D) {
    return (
      <StaticCard
        className={className}
        containerClassName={containerClassName}
        shadow={shadow}
      >
        {children}
      </StaticCard>
    );
  }

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
