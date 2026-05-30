import type { RefObject } from "react";

import { Magnetic } from "@/components/effects/magnetic";
import { BorderedImage } from "@/components/shared/bordered-image";

interface HeroProfileProps {
  imageRef: RefObject<HTMLDivElement | null>;
  profileImageSrc: string;
}

export const HeroProfile = ({
  imageRef,
  profileImageSrc,
}: HeroProfileProps) => (
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
);
