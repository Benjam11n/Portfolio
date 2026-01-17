"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { RefObject } from "react";

type CardMouseTrackingOptions = {
  rotationIntensity?: number; // Default: 15 (degrees max rotation)
  parallaxIntensity?: number; // Default: 0.1 (content parallax multiplier)
  glare?: boolean; // Default: true
  glareIntensity?: number; // Default: 0.8
};

type CardMouseTrackingRefs = {
  cardRef: RefObject<HTMLDivElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  glareRef: RefObject<HTMLDivElement | null>;
};

export const useCardMouseTracking = (
  { cardRef, contentRef, glareRef }: CardMouseTrackingRefs,
  options: CardMouseTrackingOptions = {}
) => {
  const {
    rotationIntensity = 15,
    parallaxIntensity = 0.1,
    glare = true,
    glareIntensity = 0.8,
  } = options;

  const { contextSafe } = useGSAP({ scope: cardRef });

  const onMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
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
  });

  const onMouseLeave = contextSafe(() => {
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
  });

  return {
    onMouseMove,
    onMouseLeave,
  };
};
