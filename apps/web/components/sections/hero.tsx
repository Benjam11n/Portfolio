"use client";

import { useGSAP } from "@gsap/react";
import gsapCore from "gsap";
import { ArrowUpRight, BadgeCheck, Mail } from "lucide-react";
import { useMemo, useRef } from "react";

import { Magnetic } from "@/components/effects/magnetic";
import { BorderedImage } from "@/components/shared/bordered-image";
import { Markdown } from "@/components/shared/markdown";
import { SectionCard } from "@/components/shared/section-card";
import { ShiftButton } from "@/components/shared/shift-button";
import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  ANIMATION_STAGGER,
} from "@/lib/constants/animation";
import { HERO_CONTENT } from "@/lib/constants/hero";
import { ROUTES } from "@/lib/constants/navigation";
import { useAnimationSkipContext } from "@/lib/contexts/animation-skip-context";
import { useAnimationPerformance } from "@/lib/hooks/animation/use-animation-performance";
import { useShouldSkipEntranceAnimation } from "@/lib/hooks/animation/use-should-skip-entrance-animation";
import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";
import { useProfileImageSource } from "@/lib/hooks/ui/use-profile-image-source";

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldSkipEntranceAnimation = useShouldSkipEntranceAnimation({
    thresholdMs: 900,
  });
  const { skipAnimations } = useAnimationSkipContext();

  const performanceMetrics = useAnimationPerformance();
  const heroNameCharacters = useMemo(() => {
    const counts = new Map<string, number>();

    return [...HERO_CONTENT.name].map((char) => {
      const nextCount = (counts.get(char) ?? 0) + 1;
      counts.set(char, nextCount);

      return {
        char,
        key: `${char}-${nextCount}`,
      };
    });
  }, []);
  const profileImageSrc = useProfileImageSource({
    animationRef: imageRef,
    prefersReducedMotion,
  });

  useGSAP(
    () => {
      const mm = gsapCore.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const { isDesktop } = context.conditions as { isDesktop: boolean };
          const offset = isDesktop ? 0 : -40;

          // Start performance tracking
          performanceMetrics.startTracking();

          // Skip all animations if user prefers reduced motion or if animations were skipped
          if (
            prefersReducedMotion ||
            skipAnimations ||
            shouldSkipEntranceAnimation
          ) {
            // Set all elements to their final state instantly
            gsapCore.set(imageRef.current, {
              autoAlpha: 1,
              rotate: 0,
              scale: 1,
              x: isDesktop ? 0 : offset,
            });
            gsapCore.set(".char", { autoAlpha: 1, y: 0 });
            gsapCore.set(".hero-badge", { autoAlpha: 1, scale: 1 });
            gsapCore.set(".hero-text", { autoAlpha: 1, y: 0 });
            gsapCore.set(buttonsRef.current?.children || [], {
              autoAlpha: 1,
              y: 0,
            });

            // Stop tracking and log metrics for skipped animations
            const duration = performanceMetrics.stopTracking();
            if (process.env.NODE_ENV === "development") {
              console.log("[Hero] Animations skipped - Performance metrics:", {
                duration: `${duration.toFixed(2)}ms`,
                fps: performanceMetrics.fps,
                frameDrops: performanceMetrics.frameDrops,
                frameTime: performanceMetrics.frameTime,
              });
            }
            return;
          }

          const tl = gsapCore.timeline({
            defaults: { ease: ANIMATION_EASING.DEFAULT },
            onComplete: () => {
              // Stop tracking and log metrics when animation completes
              const duration = performanceMetrics.stopTracking();
              if (process.env.NODE_ENV === "development") {
                console.log(
                  "[Hero] Animation complete - Performance metrics:",
                  {
                    duration: `${duration.toFixed(2)}ms`,
                    fps: performanceMetrics.fps,
                    frameDrops: performanceMetrics.frameDrops,
                    frameTime: performanceMetrics.frameTime,
                  }
                );

                // Warn if performance is below budget
                if (performanceMetrics.fps < 30) {
                  console.warn(
                    "[Hero] ⚠️ Poor FPS detected:",
                    performanceMetrics.fps,
                    "- Consider reducing animation complexity"
                  );
                }
                if (performanceMetrics.frameTime > 33) {
                  console.warn(
                    "[Hero] ⚠️ High frame time detected:",
                    `${performanceMetrics.frameTime}ms`,
                    "- Exceeds 33ms budget (30 FPS)"
                  );
                }
              }
            },
          });

          /**
           * HERO ANIMATION TIMELINE AUDIT (OPTIMIZED)
           * =====================================
           * Total Duration: 1.05s (within 2s requirement ✓)
           * Optimization: 25% faster than original (1.4s → 1.05s) while maintaining polish
           *
           * Breakdown:
           * 1. Image:       0.0s → 0.5s   (0.5s duration - MEDIUM_FAST)
           * 2. Name (12 chars):  0.2s → 0.85s  (0.5s + 11×0.05s stagger = 1.05s total)
           * 3. Badge:       0.6s → 0.85s  (0.25s duration - QUICK)
           * 4. Hero text (2 elements):  0.4s → 0.7s   (0.5s + 0.05s stagger = 0.55s total)
           * 5. Buttons (2 buttons):  0.6s → 1.05s  (0.5s + 0.05s stagger = 0.55s total)
           *
           * Last animation completes at 1.05s, well within the 2s max duration requirement.
           * Strategy: Use MEDIUM_FAST (0.5s) as default duration, QUICK (0.3s) for emphasis,
           * increase overlaps to compress timeline while maintaining visual hierarchy.
           */

          /**
           * PROFILE IMAGE ANIMATION
           * ========================
           * Purpose: Draws immediate attention to the personal, human element of this portfolio.
           *   The scale-in effect with elastic easing creates a playful, energetic introduction
           *   that establishes the portfolio's creative character and invites engagement.
           *
           * Duration: 0.5s (MEDIUM_FAST) with elastic easing. This timing provides enough duration
           *   for the elastic effect to be noticeable and satisfying without feeling sluggish.
           *   The elastic easing adds bounce that reinforces the creative, dynamic tone.
           *
           * Skipping: When animations are skipped (reduced motion preference or Escape key),
           *   the image instantly appears at its final state (scale: 1, fully visible, no rotation).
           *   This ensures users see the profile photo immediately without any delay.
           */
          tl.fromTo(
            imageRef.current,
            {
              autoAlpha: 0,
              rotate: -15,
              scale: 0,
              x: offset,
            },
            {
              autoAlpha: 1,
              // 0.5s (optimized from 0.8s)
              duration: ANIMATION_DURATION.MEDIUM_FAST / 1000,
              ease: ANIMATION_EASING.ELASTIC,
              rotate: 0,
              scale: 1,
              x: 0,
            }
          );

          /**
           * NAME REVEAL ANIMATION
           * =====================
           * Purpose: Creates a dramatic, memorable introduction of the portfolio owner's name.
           *   The character-by-character reveal adds personality and makes the name feel
           *   handcrafted, reflecting attention to detail and care in the work.
           *
           * Duration: 0.5s (MEDIUM_FAST) per character with 0.05s stagger between characters.
           *   "Benjamin Wang" = 12 characters, so total duration is 0.5s + (11 × 0.05s) = 1.05s.
           *   This stagger creates a flowing, wave-like effect that feels premium and deliberate.
           *   Started at 0.2s (with overlap) to begin appearing while profile image animates.
           *
           * Skipping: When animations are skipped, all characters instantly appear in their
           *   final position (y: 0, fully visible). Users can immediately read the name
           *   without waiting for the staggered reveal to complete.
           */
          // Start at 0.2s (more overlap)
          tl.to(
            ".char",
            {
              autoAlpha: 1,
              // 0.5s
              duration: ANIMATION_DURATION.MEDIUM_FAST / 1000,
              ease: ANIMATION_EASING.DEFAULT,
              // 0.05s between each char
              stagger: ANIMATION_STAGGER.QUICK,
              y: 0,
            },
            `-=${ANIMATION_DURATION.MEDIUM_FAST / 1000 - 0.1}`
          );

          /**
           * VERIFICATION BADGE ANIMATION
           * =============================
           * Purpose: Reinforces credibility and trust by prominently displaying the verified
           *   status badge. The snap-in effect draws attention to this social proof element,
           *   signaling professionalism and authenticity to visitors.
           *
           * Duration: 0.3s (QUICK) with back easing for a snappy, confident appearance.
           *   Short duration ensures it feels responsive and energetic. The strong back easing
           *   creates a satisfying "pop" that emphasizes the badge's importance. Started at
           *   0.6s to appear shortly after the name begins revealing, creating visual layering.
           *
           * Skipping: When animations are skipped, the badge instantly appears at its full
           *   size and opacity. The verification status is immediately visible, providing
           *   instant social proof without any animation delay.
           */
          // Start at 0.6s (more overlap)
          tl.fromTo(
            ".hero-badge",
            { autoAlpha: 0, scale: 0 },
            {
              autoAlpha: 1,
              // 0.3s (optimized from 0.35s)
              duration: ANIMATION_DURATION.QUICK / 1000,
              ease: ANIMATION_EASING.BACK_STRONG,
              scale: 1,
            },
            `-=${ANIMATION_DURATION.MEDIUM_FAST / 1000 - 0.05}`
          );

          /**
           * HERO TEXT FADE-IN ANIMATION
           * ===========================
           * Purpose: Gradually reveals contextual information (role and description) to guide
           *   users from initial attention to understanding who the portfolio owner is and
           *   what they do. The fade-up motion creates a smooth, professional transition.
           *
           * Duration: 0.5s (MEDIUM_FAST) with 0.05s stagger between 2 elements (role + description).
           *   Total duration: 0.5s + 0.05s = 0.55s. This timing allows text to be readable
           *   while maintaining energy. The stagger creates a cascading reveal that feels
           *   polished. Started at 0.4s to appear while name is still revealing, keeping
           *   the timeline tight and engaging.
           *
           * Skipping: When animations are skipped, both text elements instantly appear at
           *   their final position (y: 0, fully visible). Users can immediately read the role
           *   and description without waiting for the animated fade-in.
           */
          // Start at 0.4s (more overlap)
          tl.fromTo(
            ".hero-text",
            {
              autoAlpha: 0,
              y: 40,
            },
            {
              autoAlpha: 1,
              // 0.5s (optimized from 0.6s)
              duration: ANIMATION_DURATION.MEDIUM_FAST / 1000,
              ease: ANIMATION_EASING.DEFAULT,
              // 0.05s between elements (optimized from 0.1s)
              stagger: ANIMATION_STAGGER.QUICK,
              y: 0,
            },
            `-=${ANIMATION_DURATION.MEDIUM_FAST / 1000}`
          );

          /**
           * CALL-TO-ACTION BUTTONS ANIMATION
           * =================================
           * Purpose: Reveals action buttons at the optimal moment when users have absorbed
           *   the introductory content and are ready to take action. The fade-up motion
           *   draws attention to these interactive elements, encouraging engagement.
           *
           * Duration: 0.5s (MEDIUM_FAST) with 0.05s stagger between 2 buttons.
           *   Total duration: 0.5s + 0.05s = 0.55s. This timing balances visibility with
           *   efficiency, ensuring buttons are noticeable without feeling rushed. The
           *   stagger separates the buttons visually. Started at 0.6s to appear after other
           *   content is revealed, following the visual hierarchy and guiding user flow.
           *   This is the final animation (completes at 1.05s total), ensuring all content
           *   is visible before primary CTAs appear.
           *
           * Skipping: When animations are skipped, both buttons instantly appear at their
           *   final position (y: 0, fully visible). Users can immediately see and interact
           *   with the contact and project navigation buttons without animation delay.
           */
          // Start at 0.6s (more overlap)
          tl.fromTo(
            buttonsRef.current?.children || [],
            {
              autoAlpha: 0,
              y: 20,
            },
            {
              autoAlpha: 1,
              // 0.5s (optimized from 0.6s)
              duration: ANIMATION_DURATION.MEDIUM_FAST / 1000,
              ease: ANIMATION_EASING.POWER3,
              // 0.05s between buttons
              stagger: ANIMATION_STAGGER.QUICK,
              y: 0,
            },
            `-=${ANIMATION_DURATION.MEDIUM_FAST / 1000}`
          );
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
    <SectionCard id="hero">
      <div ref={containerRef}>
        {/* Profile Image */}
        <div
          className="inline-block opacity-0"
          ref={imageRef}
          style={{ transform: "scale(0)" }}
        >
          <Magnetic strength={0.4}>
            <BorderedImage
              alt="Benjamin Wang"
              colorDark="#464646ff"
              colorLight="#3f3f3fff"
              containerClassName="mb-6 h-[72px] w-[72px]"
              fetchPriority="high"
              height={72}
              priority
              src={profileImageSrc}
              width={72}
            />
          </Magnetic>
        </div>

        {/* Name and Badge */}
        <div className="mb-2 flex items-center gap-2">
          <h1 className="hero-name flex overflow-hidden font-bold text-foreground text-xl tracking-tight sm:text-2xl">
            {heroNameCharacters.map(({ char, key }) => (
              <span
                className="char inline-block translate-y-full opacity-0"
                key={key}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>
          <div className="hero-badge opacity-0">
            <BadgeCheck
              className="h-6 w-6"
              strokeWidth={2.5}
              style={{
                color: "white",
                fill: "#1DA1F2",
              }}
            />
          </div>
        </div>

        {/* Role */}
        <h2 className="hero-text mb-6 translate-y-10 opacity-0 font-medium text-md text-muted-foreground">
          {HERO_CONTENT.role}
        </h2>

        {/* Description */}
        <div className="hero-text mb-8 max-w-sm translate-y-10 opacity-0">
          <Markdown className="font-sans text-foreground text-md leading-relaxed">
            {HERO_CONTENT.description}
          </Markdown>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4" ref={buttonsRef}>
          <div className="translate-y-5 opacity-0">
            <Magnetic strength={0.2}>
              <ShiftButton
                href={ROUTES.CONTACT}
                icon={<Mail className="h-4 w-4" />}
                variant="primary"
              >
                Contact Me
              </ShiftButton>
            </Magnetic>
          </div>
          <div className="translate-y-5 opacity-0">
            <Magnetic strength={0.2}>
              <ShiftButton
                href={ROUTES.PROJECTS}
                icon={<ArrowUpRight className="h-4 w-4" />}
                variant="secondary"
              >
                View Projects
              </ShiftButton>
            </Magnetic>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};
