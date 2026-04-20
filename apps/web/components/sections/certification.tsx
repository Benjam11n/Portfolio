"use client";

import { useGSAP } from "@gsap/react";
import gsapCore from "gsap";
import { useRef } from "react";

import { CertificationCard } from "@/components/shared/certification-card";
import { SectionCard } from "@/components/shared/section-card";
import { CERTIFICATIONS } from "@/lib/constants/certifications";
import { useAnimationSkipContext } from "@/lib/contexts/animation-skip-context";
import { useShouldSkipEntranceAnimation } from "@/lib/hooks/animation/use-should-skip-entrance-animation";
import { useAnimationSkipIndicator } from "@/lib/hooks/ui/use-animation-skip-indicator";
import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";

export const Certifications = () => {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { skipAnimations } = useAnimationSkipContext();
  const shouldSkipEntranceAnimation = useShouldSkipEntranceAnimation();
  const showSkipIndicator = useAnimationSkipIndicator(skipAnimations);

  useGSAP(
    () => {
      if (
        prefersReducedMotion ||
        shouldSkipEntranceAnimation ||
        skipAnimations
      ) {
        gsapCore.set(".cert-card", {
          opacity: 1,
          y: 0,
        });
        return;
      }

      gsapCore.fromTo(
        ".cert-card",
        { opacity: 0, y: 50 },
        {
          duration: 0.6,
          opacity: 1,
          scrollTrigger: {
            start: "top bottom-=100",
            trigger: containerRef.current,
          },
          stagger: 0.1,
          y: 0,
        }
      );
    },
    {
      dependencies: [
        prefersReducedMotion,
        shouldSkipEntranceAnimation,
        skipAnimations,
      ],
      scope: containerRef,
    }
  );

  return (
    <SectionCard
      id="certifications"
      ref={containerRef}
      title="Certifications & Courses"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {CERTIFICATIONS.map((cert) => (
          <div className="cert-card" key={cert.name}>
            <CertificationCard cert={cert} />
          </div>
        ))}
      </div>
      {showSkipIndicator && (
        <div className="fade-in mt-4 animate-in text-muted-foreground text-sm opacity-0 duration-300">
          Animations skipped
        </div>
      )}
    </SectionCard>
  );
};
