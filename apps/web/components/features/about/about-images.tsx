import type { RefObject } from "react";

import { AboutImageCard } from "@/components/features/about/about-image-card";

interface AboutImagesProps {
  image1Error: boolean;
  image2Error: boolean;
  onImage1Error: () => void;
  onImage2Error: () => void;
  profileImageRef: RefObject<HTMLDivElement | null>;
  profileImageSrc: string;
}

export const AboutImages = ({
  image1Error,
  image2Error,
  onImage1Error,
  onImage2Error,
  profileImageRef,
  profileImageSrc,
}: AboutImagesProps) => (
  <div className="relative mx-auto mb-4 h-24 w-28 sm:mx-0 sm:h-36 sm:w-36">
    <div className="about-image-wrapper absolute top-4 left-8 z-10 scale-0 opacity-0 sm:left-12">
      <AboutImageCard
        alt="Benjamin Wang"
        className="about-image relative h-20 w-20 rotate-6 overflow-hidden rounded-xl border border-border bg-secondary shadow-lg sm:h-32 sm:w-32"
        fallback="Photo"
        imageRef={profileImageRef}
        onError={onImage1Error}
        src={image1Error ? "" : profileImageSrc}
      />
    </div>

    <div className="about-image-wrapper absolute top-0 left-0 scale-0 opacity-0">
      <AboutImageCard
        alt="Hero Image"
        className="about-image relative h-20 w-20 rotate-3 overflow-hidden rounded-xl border-4 border-card bg-card shadow-xl sm:h-32 sm:w-32"
        fallback="Hero Image"
        onError={onImage2Error}
        src={image2Error ? "" : "/hero.avif"}
      />
    </div>
  </div>
);
