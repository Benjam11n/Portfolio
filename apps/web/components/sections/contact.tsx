"use client";

import { useEffect, useRef, useState } from "react";
import { ContactForm } from "@/components/forms/contact-form";
import { SectionCard } from "@/components/shared/section-card";
import { CONTACT_INFO } from "@/lib/constants/socials";
import { useAnimationSkipContext } from "@/lib/contexts/animation-skip-context";
import { useScrollReveal } from "@/lib/hooks/animation/use-scroll-reveal";

export const Contact = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { skipAnimations } = useAnimationSkipContext();
  const [showSkipIndicator, setShowSkipIndicator] = useState(false);

  /**
   * CONTACT ANIMATION TIMELINE
   * ==========================
   * Total Duration: Variable (depends on number of child elements)
   * Trigger: Scroll-based (via useScrollReveal hook)
   *
   * Breakdown (for N elements):
   * Each element: 0.3s duration with 0.08s stagger
   * Total: 0.3s + (N-1) × 0.08s
   *
   * Typical elements: intro text, social icons, form = ~0.54s total
   *
   * Strategy: Quick, subtle slide-up reveals keep focus on the form.
   * Minimal motion maintains professionalism while adding polish.
   */

  /**
   * CONTENT REVEAL ANIMATION
   * =======================
   * Purpose: Reveals contact section content with subtle, quick animations that
   *   don't distract from the primary goal: encouraging users to reach out.
   *   The minimal slide-up effect (15px) adds polish without drawing attention
   *   away from the contact form and call-to-action.
   *
   * Duration: 0.3s per element with 0.08s stagger between elements.
   *   Very quick duration ensures the animation feels responsive and doesn't
   *   delay user interaction. The tight stagger (0.08s) creates a smooth
   *   flowing reveal that feels cohesive without being noticeable. Small
   *   vertical movement (15px) adds just enough motion to feel intentional.
   *
   * Implementation: Uses the useScrollReveal custom hook for consistent,
   *   optimized scroll-triggered animations across the application.
   *
   * Skipping: When animations are skipped, all elements instantly appear
   *   in their final position (y: 0, fully visible). Users can immediately
   *   see the contact information and form without any delay.
   */
  useScrollReveal(containerRef, "div > *", {
    duration: 0.3,
    stagger: 0.08,
    y: 15,
    skipAnimations,
  });

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
    <SectionCard id="contact" title="Contact">
      <div className="flex flex-col gap-4" ref={containerRef}>
        <div>
          <p className="mb-2 max-w-md font-sans text-md text-muted-foreground">
            I'm always up for a chat. Whether you have a project in mind, want
            to collaborate, or just want to say hi, feel free to drop me a
            message.
          </p>
          <p className="mb-8 text-muted-foreground/60 text-xs italic">
            * Your information is not stored. It is sent directly to my personal
            accounts.
          </p>

          <div className="flex items-center gap-4">
            {CONTACT_INFO.map((item) => (
              <a
                className="group relative transition-transform hover:scale-110"
                href={item.link}
                key={item.title}
                rel="noopener noreferrer"
                target="_blank"
              >
                <item.icon className="h-5 w-5 text-foreground transition-colors duration-300" />
                <span className="sr-only">{item.title}</span>
              </a>
            ))}
          </div>
        </div>

        <ContactForm />
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
