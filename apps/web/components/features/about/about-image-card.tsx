import Image from "next/image";
import type { RefObject } from "react";

import { Magnetic } from "@/components/effects/magnetic";

interface AboutImageCardProps {
  alt: string;
  className: string;
  fallback: string;
  imageRef?: RefObject<HTMLDivElement | null>;
  onError: () => void;
  src: string;
}

export const AboutImageCard = ({
  alt,
  className,
  fallback,
  imageRef,
  onError,
  src,
}: AboutImageCardProps) => (
  <Magnetic strength={imageRef ? 0.3 : 0.4}>
    <div className={className} ref={imageRef}>
      {src ? (
        <Image
          alt={alt}
          className={
            alt === "Hero Image"
              ? "object-cover opacity-80"
              : "object-cover transition-transform duration-500 hover:scale-110"
          }
          fetchPriority="high"
          fill
          onError={onError}
          priority
          sizes="(max-width: 640px) 100px, 150px"
          src={src}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">
          {fallback}
        </div>
      )}
    </div>
  </Magnetic>
);
