"use client";

import { Mail } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";

import { Magnetic } from "@/components/effects/magnetic";
import { LightweightMarkdown } from "@/components/shared/lightweight-markdown";
import { SectionCard } from "@/components/shared/section-card";
import { ShiftButton } from "@/components/shared/shift-button";
import { ABOUT_CONTENT } from "@/lib/constants/about";
import { ROUTES } from "@/lib/constants/navigation";
import { useAnimationSkipContext } from "@/lib/contexts/animation-skip-context";
import { useAboutAnimation } from "@/lib/hooks/animation/use-about-animation";
import { useShouldSkipEntranceAnimation } from "@/lib/hooks/animation/use-should-skip-entrance-animation";
import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";
import { useProfileImageSource } from "@/lib/hooks/ui/use-profile-image-source";

export const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const profileImageRef = useRef<HTMLDivElement>(null);
  const [image1Error, setImage1Error] = useState(false);
  const [image2Error, setImage2Error] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldSkipEntranceAnimation = useShouldSkipEntranceAnimation();
  const { skipAnimations } = useAnimationSkipContext();
  const profileImageSrc = useProfileImageSource({
    animationRef: profileImageRef,
    prefersReducedMotion,
  });
  const handleImage1Error = useCallback(() => {
    setImage1Error(true);
  }, []);
  const handleImage2Error = useCallback(() => {
    setImage2Error(true);
  }, []);
  useAboutAnimation({
    containerRef,
    prefersReducedMotion,
    shouldSkipEntranceAnimation,
    skipAnimations,
  });

  return (
    <SectionCard id="about" title="About Me">
      {/* Content Wrapper */}
      <div className="flex flex-col gap-4" ref={containerRef}>
        {/* Images Stack */}
        <div className="relative mx-auto mb-4 h-24 w-28 sm:mx-0 sm:h-36 sm:w-36">
          {/* Image 1 (Front) */}
          <div className="about-image-wrapper absolute top-4 left-8 z-10 scale-0 opacity-0 sm:left-12">
            <Magnetic strength={0.3}>
              <div
                className="about-image relative h-20 w-20 rotate-6 overflow-hidden rounded-xl border border-border bg-secondary shadow-lg sm:h-32 sm:w-32"
                ref={profileImageRef}
              >
                {image1Error ? (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">
                    Photo
                  </div>
                ) : (
                  <Image
                    alt="Benjamin Wang"
                    className="object-cover transition-transform duration-500 hover:scale-110"
                    fetchPriority="high"
                    fill
                    onError={handleImage1Error}
                    priority
                    sizes="(max-width: 640px) 100px, 150px"
                    src={profileImageSrc}
                  />
                )}
              </div>
            </Magnetic>
          </div>

          {/* Image 2 (Back) */}
          <div className="about-image-wrapper absolute top-0 left-0 scale-0 opacity-0">
            <Magnetic strength={0.4}>
              <div className="about-image relative h-20 w-20 rotate-3 overflow-hidden rounded-xl border-4 border-card bg-card shadow-xl sm:h-32 sm:w-32">
                {image2Error ? (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">
                    Hero Image
                  </div>
                ) : (
                  <Image
                    alt="Hero Image"
                    className="object-cover opacity-80"
                    fetchPriority="high"
                    fill
                    onError={handleImage2Error}
                    priority
                    sizes="(max-width: 640px) 100px, 150px"
                    src="/hero.avif"
                  />
                )}
              </div>
            </Magnetic>
          </div>
        </div>

        {/* Text */}
        <div className="text-foreground text-md leading-relaxed">
          <div className="about-text translate-y-8 opacity-0">
            <LightweightMarkdown>
              {ABOUT_CONTENT.description}
            </LightweightMarkdown>
          </div>
        </div>

        <div className="about-button opacity-0">
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
