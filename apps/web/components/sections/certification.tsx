"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { CertificationCard } from "@/components/shared/certification-card";
import { SectionCard } from "@/components/shared/section-card";
import { CERTIFICATIONS } from "@/lib/constants/certifications";
import { useAnimationSkipContext } from "@/lib/contexts/animation-skip-context";

export const Certifications = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { skipAnimations } = useAnimationSkipContext();
  const [showSkipIndicator, setShowSkipIndicator] = useState(false);

  useGSAP(
    () => {
      /**
       * CERTIFICATION ANIMATION TIMELINE
       * ================================
       * Total Duration: Variable (depends on number of certifications)
       * Trigger: Scroll-based (starts when section is near viewport)
       *
       * Breakdown (for N certifications):
       * Each card: 0.6s duration with 0.1s stagger
       * Total: 0.6s + (N-1) × 0.1s
       *
       * Example (6 certifications): 0.6s + 0.5s = 1.1s total
       *
       * Strategy: Slide-up reveal emphasizes credentials.
       * Consistent with experience section for visual coherence.
       */

      if (skipAnimations) {
        // Skip animations - set elements to final state immediately
        gsap.set(".cert-card", {
          y: 0,
          opacity: 1,
        });
      } else {
        /**
         * CERTIFICATION CARD REVEAL ANIMATION
         * ===================================
         * Purpose: Displays professional certifications with an upward slide-in
         *   effect that emphasizes credentials and achievement. The vertical movement
         *   from 50px below creates a sense of elevation and importance, reinforcing
         *   the value of these professional qualifications.
         *
         * Duration: 0.6s per card with 0.1s stagger between cards.
         *   The moderate duration allows the animation to feel smooth and deliberate,
         *   giving each certification its moment of focus. The standard stagger
         *   creates a steady, professional reveal that's easy to follow. The trigger
         *   point ("top bottom-=100") starts animations slightly earlier than other
         *   sections for a more gradual, anticipation-building entrance.
         *
         * Consistency: Uses similar timing to the experience section (0.6s duration,
         *   0.1s stagger) to maintain visual coherence across chronological content.
         *   The slide-up motion parallels the experience section's upward movement,
         *   creating a consistent visual language for professional milestones.
         *
         * Skipping: When animations are skipped, all certification cards instantly
         *   appear in their final position (y: 0, fully visible). Users can
         *   immediately review credentials without waiting for the animation.
         */
        // Normal animation
        gsap.fromTo(
          ".cert-card",
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom-=100",
            },
          }
        );
      }
    },
    { scope: containerRef, dependencies: [skipAnimations] }
  );

  // Show skip indicator when animations are skipped via Escape key
  useEffect(() => {
    if (skipAnimations) {
      setShowSkipIndicator(true);
      const timer = setTimeout(() => {
        setShowSkipIndicator(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [skipAnimations]);

  return (
    <SectionCard id="certifications" ref={containerRef} title="Certifications">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {CERTIFICATIONS.map((cert) => (
          <div className="cert-card" key={cert.name}>
            <CertificationCard cert={cert} />
          </div>
        ))}
      </div>

      {/* Skip Indicator */}
      {showSkipIndicator && (
        <div className="fade-in mt-4 animate-in text-muted-foreground text-sm opacity-0 duration-300">
          Animations skipped
        </div>
      )}
    </SectionCard>
  );
};
