"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Mail } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Magnetic } from "@/components/effects/magnetic";
import { SectionCard } from "@/components/shared/section-card";
import { ShiftButton } from "@/components/shared/shift-button";
import { ABOUT_CONTENT } from "@/lib/constants/about";
import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  ANIMATION_STAGGER,
} from "@/lib/constants/animation";
import { ROUTES } from "@/lib/constants/navigation";
import { useAnimationSkipContext } from "@/lib/contexts/animation-skip-context";
import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";
import { Markdown } from "../shared/markdown";

export const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [image1Error, setImage1Error] = useState(false);
  const [image2Error, setImage2Error] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { skipAnimations } = useAnimationSkipContext();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const { isDesktop } = context.conditions as {
            isDesktop: boolean;
          };
          const offset = isDesktop ? -220 : -40;

          // Skip all animations if user prefers reduced motion or if animations were skipped
          if (prefersReducedMotion || skipAnimations) {
            // Set all elements to their final state instantly
            gsap.set(".about-image-wrapper", {
              scale: 1,
              autoAlpha: 1,
              rotate: (i) => (i === 0 ? -6 : 3),
            });
            gsap.set(".about-text", { y: 0, autoAlpha: 1 });
            gsap.set(".about-button", { scale: 1, autoAlpha: 1, x: 0 });
            return;
          }

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
            defaults: { ease: ANIMATION_EASING.DEFAULT },
          });

          /**
           * ABOUT ANIMATION TIMELINE
           * =========================
           * Total Duration: ~1.5s
           * Trigger: Scroll-based (starts when section reaches 80% viewport)
           *
           * Breakdown:
           * 1. Images (2 items):    0.0s → 1.1s  (0.8s + 0.15s stagger)
           * 2. Parallax effect:     Continuous during scroll
           * 3. Text (2 paragraphs): 0.3s → 1.1s  (0.7s + 0.1s stagger, with overlap)
           * 4. Button:              0.6s → 1.2s  (0.6s duration, with overlap)
           *
           * Strategy: Layer images and text animations for visual interest,
           * use elastic easing on images for playful personality, maintain
           * readability with smooth text reveals.
           */

          /**
           * PROFILE IMAGES POP-UP ANIMATION
           * ===============================
           * Purpose: Creates visual interest and personality by showcasing personal photos
           *   with an elastic bounce effect. The overlapping images with slight rotation
           *   add depth and playfulness, making the section feel more personal and engaging.
           *
           * Duration: 0.8s (LONG) per image with 0.15s stagger between the two images.
           *   The longer duration allows the elastic easing to fully express itself,
           *   creating a satisfying bounce that draws attention to the personal photos.
           *   Images start at different rotation angles (-15° and 15°) and settle at
           *   more subtle angles (-6° and 3°) for a natural, layered look.
           *
           * Skipping: When animations are skipped, both images instantly appear at their
           *   final state (scale: 1, fully visible, final rotation). Users immediately
           *   see the photos without waiting for the elastic animation.
           */
          tl.fromTo(
            ".about-image-wrapper",
            {
              scale: 0,
              autoAlpha: 0,
              rotate: (i) => (i === 0 ? -15 : 15),
            },
            {
              scale: 1,
              autoAlpha: 1,
              rotate: (i) => (i === 0 ? -6 : 3),
              duration: ANIMATION_DURATION.LONG / 1000, // 0.8s
              stagger: ANIMATION_STAGGER.SLOW, // 0.15s
              ease: ANIMATION_EASING.ELASTIC,
            }
          );

          /**
           * PARALLAX SCROLL EFFECT
           * ======================
           * Purpose: Adds depth and interactivity as users scroll through the section.
           *   The subtle vertical movement (-10%) creates a sense of three-dimensionality
           *   and makes the images feel more tangible and engaging.
           *
           * Duration: Continuous during scroll, with scrub: true for direct 1:1 control.
           *   Reduced from -20% to -10% for a smoother, more subtle effect that doesn't
           *   cause motion sickness while still providing visual interest.
           *
           * Skipping: Parallax is passive and doesn't block content, so it's always active.
           *   Users with reduced motion preferences won't notice this effect anyway due to
           *   system-level motion reduction settings.
           */
          gsap.to(".about-image", {
            yPercent: -10,
            ease: ANIMATION_EASING.NONE,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });

          /**
           * TEXT REVEAL ANIMATION
           * =====================
           * Purpose: Reveals biographical content in a gradual, readable sequence.
           *   The upward fade-in ensures text is legible while adding polish and
           *   sophistication. Staggered paragraphs create a natural reading flow.
           *
           * Duration: 0.7s (MEDIUM_SLOW) per paragraph with 0.1s stagger.
           *   The moderate speed ensures readability while still providing visual interest.
           *   Started with overlap (0.8s) so text begins appearing while images finish
           *   their animation, reducing total perceived wait time.
           *
           * Skipping: When animations are skipped, all text paragraphs instantly appear
           *   in their final position (y: 0, fully visible). Users can immediately
           *   read the content without waiting for the staggered reveal.
           */
          tl.from(
            ".about-text",
            {
              y: 30,
              autoAlpha: 0,
              duration: ANIMATION_DURATION.MEDIUM_SLOW / 1000, // 0.7s
              stagger: ANIMATION_STAGGER.STANDARD, // 0.1s
            },
            `-=${ANIMATION_DURATION.LONG / 1000}` // 0.8s overlap
          );

          /**
           * CONTACT BUTTON ENTRANCE
           * =======================
           * Purpose: Highlights the call-to-action button with an emphatic pop-in effect.
           *   The scale animation from zero with back easing draws attention and encourages
           *   interaction, making it clear this is an actionable element.
           *
           * Duration: 0.6s (STANDARD) with back easing for a confident appearance.
           *   The back.out(1.7) easing creates a slight overshoot that feels energetic
           *   and clickable. Slides in from the side (offset) to add directional motion.
           *   Started with overlap (0.5s) to appear while text is still revealing.
           *
           * Skipping: When animations are skipped, the button instantly appears at its
           *   final state (scale: 1, fully visible, no offset). Users can immediately
           *   see and interact with the call-to-action.
           */
          tl.fromTo(
            ".about-button",
            {
              scale: 0,
              autoAlpha: 0,
              x: offset,
            },
            {
              scale: 1,
              autoAlpha: 1,
              x: 0,
              duration: ANIMATION_DURATION.STANDARD / 1000, // 0.6s
              ease: ANIMATION_EASING.BACK_MEDIUM,
            },
            `-=${ANIMATION_DURATION.MEDIUM_FAST / 1000}` // 0.5s overlap
          );
        }
      );
    },
    {
      scope: containerRef,
      dependencies: [prefersReducedMotion, skipAnimations],
    }
  );

  return (
    <SectionCard id="about" title="About Me">
      {/* Content Wrapper */}
      <div className="flex flex-col gap-4" ref={containerRef}>
        {/* Images Stack */}
        <div className="relative mx-auto mb-4 h-24 w-28 sm:mx-0 sm:h-36 sm:w-36">
          {/* Image 1 (Back) */}
          <div className="about-image-wrapper absolute top-0 left-0">
            <Magnetic strength={0.3}>
              <div className="about-image relative h-20 w-20 rotate-[-6deg] overflow-hidden rounded-xl border border-border bg-secondary shadow-lg sm:h-32 sm:w-32">
                {image1Error ? (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">
                    Photo
                  </div>
                ) : (
                  <Image
                    alt="Benjamin Wang"
                    className="object-cover transition-transform duration-500 hover:scale-110"
                    fill
                    onError={() => setImage1Error(true)}
                    sizes="(max-width: 640px) 100px, 150px"
                    src="/benjamin.png"
                  />
                )}
              </div>
            </Magnetic>
          </div>

          {/* Image 2 (Front) */}
          <div className="about-image-wrapper absolute top-4 left-8 z-10 sm:left-12">
            <Magnetic strength={0.4}>
              <div className="about-image relative h-20 w-20 rotate-[3deg] overflow-hidden rounded-xl border-4 border-card bg-card shadow-xl sm:h-32 sm:w-32">
                {image2Error ? (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">
                    Workspace
                  </div>
                ) : (
                  <Image
                    alt="Minimal Workspace"
                    className="object-cover opacity-80"
                    fill
                    onError={() => setImage2Error(true)}
                    sizes="(max-width: 640px) 100px, 150px"
                    src="/assets/workspace.png"
                  />
                )}
              </div>
            </Magnetic>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-6 text-foreground text-md leading-relaxed">
          <div className="about-text">
            <Markdown>{ABOUT_CONTENT.p1}</Markdown>
          </div>
          <div className="about-text">
            <Markdown>{ABOUT_CONTENT.p2}</Markdown>
          </div>
        </div>

        <div className="about-button">
          <Magnetic strength={0.25}>
            <ShiftButton
              href={ROUTES.CONTACT}
              icon={<Mail className="h-4 w-4" />}
              variant="primary"
            >
              Get in Touch
            </ShiftButton>
          </Magnetic>
        </div>
      </div>
    </SectionCard>
  );
};
