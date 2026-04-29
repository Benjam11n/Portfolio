"use client";

import { ArrowUpRight, BadgeCheck, Mail } from "lucide-react";
import { useMemo, useRef } from "react";

import { Magnetic } from "@/components/effects/magnetic";
import { BorderedImage } from "@/components/shared/bordered-image";
import { LightweightMarkdown } from "@/components/shared/lightweight-markdown";
import { SectionCard } from "@/components/shared/section-card";
import { ShiftButton } from "@/components/shared/shift-button";
import { HERO_CONTENT } from "@/lib/constants/hero";
import { ROUTES } from "@/lib/constants/navigation";
import { useAnimationSkipContext } from "@/lib/contexts/animation-skip-context";
import { useHeroAnimation } from "@/lib/hooks/animation/use-hero-animation";
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
  useHeroAnimation({
    buttonsRef,
    containerRef,
    imageRef,
    prefersReducedMotion,
    shouldSkipEntranceAnimation,
    skipAnimations,
  });

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
          <LightweightMarkdown className="font-sans text-foreground text-md leading-relaxed">
            {HERO_CONTENT.description}
          </LightweightMarkdown>
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
