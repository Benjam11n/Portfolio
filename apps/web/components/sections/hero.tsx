"use client";

import { useMemo, useRef } from "react";

import { HeroActions } from "@/components/features/hero/hero-actions";
import { HeroProfile } from "@/components/features/hero/hero-profile";
import { HeroTitle } from "@/components/features/hero/hero-title";
import { LightweightMarkdown } from "@/components/shared/lightweight-markdown";
import { SectionCard } from "@/components/shared/section-card";
import { HERO_CONTENT } from "@/lib/constants/hero";
import { useAnimationSkipContext } from "@/lib/contexts/animation-skip-context";
import { useHeroAnimation } from "@/lib/hooks/animation/use-hero-animation";
import { useShouldSkipEntranceAnimation } from "@/lib/hooks/animation/use-should-skip-entrance-animation";
import { useShouldReduceMotion } from "@/lib/hooks/performance/use-should-reduce-motion";
import { useProfileImageSource } from "@/lib/hooks/ui/use-profile-image-source";

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useShouldReduceMotion();
  const shouldSkipEntranceAnimation = useShouldSkipEntranceAnimation({
    thresholdMs: 900,
  });
  const { skipAnimations } = useAnimationSkipContext();
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
    shouldReduceMotion,
  });
  useHeroAnimation({
    buttonsRef,
    containerRef,
    imageRef,
    shouldReduceMotion,
    shouldSkipEntranceAnimation,
    skipAnimations,
  });

  return (
    <SectionCard id="hero">
      <div ref={containerRef}>
        <HeroProfile imageRef={imageRef} profileImageSrc={profileImageSrc} />

        <HeroTitle characters={heroNameCharacters} />

        {/* Role */}
        <h2 className="hero-text mb-6 translate-y-10 opacity-0 font-medium text-md text-muted-foreground">
          {HERO_CONTENT.role}
        </h2>

        {/* Description */}
        <div className="hero-text mb-8 max-w-sm translate-y-10 opacity-0">
          <LightweightMarkdown className="font-sans text-foreground text-md leading-relaxed">
            {HERO_CONTENT.description}
          </LightweightMarkdown>
        </div>

        <HeroActions buttonsRef={buttonsRef} />
      </div>
    </SectionCard>
  );
};
