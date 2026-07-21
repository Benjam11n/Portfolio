"use client";

import { useCallback, useRef, useState } from "react";

import { AboutContent } from "@/components/features/about/about-content";
import { AboutImages } from "@/components/features/about/about-images";
import { SectionCard } from "@/components/shared/section-card";
import { useAnimationSkipContext } from "@/lib/contexts/animation-skip-context";
import { useAboutAnimation } from "@/lib/hooks/animation/use-about-animation";
import { useShouldSkipEntranceAnimation } from "@/lib/hooks/animation/use-should-skip-entrance-animation";
import { useShouldReduceMotion } from "@/lib/hooks/performance/use-should-reduce-motion";
import { useProfileImageSource } from "@/lib/hooks/ui/use-profile-image-source";

export const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const profileImageRef = useRef<HTMLDivElement>(null);
  const [image1Error, setImage1Error] = useState(false);
  const [image2Error, setImage2Error] = useState(false);
  const shouldReduceMotion = useShouldReduceMotion();
  const shouldSkipEntranceAnimation = useShouldSkipEntranceAnimation();
  const { skipAnimations } = useAnimationSkipContext();
  const profileImageSrc = useProfileImageSource({
    animationRef: profileImageRef,
    shouldReduceMotion,
  });
  const handleImage1Error = useCallback(() => {
    setImage1Error(true);
  }, []);
  const handleImage2Error = useCallback(() => {
    setImage2Error(true);
  }, []);
  useAboutAnimation({
    containerRef,
    shouldReduceMotion,
    shouldSkipEntranceAnimation,
    skipAnimations,
  });

  return (
    <SectionCard id="about" title="About Me">
      {/* Content Wrapper */}
      <div className="flex flex-col gap-4" ref={containerRef}>
        <AboutImages
          image1Error={image1Error}
          image2Error={image2Error}
          onImage1Error={handleImage1Error}
          onImage2Error={handleImage2Error}
          profileImageRef={profileImageRef}
          profileImageSrc={profileImageSrc}
        />
        <AboutContent />
      </div>
    </SectionCard>
  );
};
