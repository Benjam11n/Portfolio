"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

import { Card3D } from "@/components/effects/card-3d";
import type { Certification } from "@/lib/types";

import { Markdown } from "../shared/markdown";

interface CertificationCardProps {
  cert: Certification;
}

export const CertificationCard = ({ cert }: CertificationCardProps) => {
  const [imageError, setImageError] = useState(false);
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <Card3D
      className="p-6 shadow-sm"
      glare
      parallaxIntensity={0.05}
      rotationIntensity={6}
      thickness={4}
    >
      <div className="relative">
        <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg bg-secondary shadow-inner">
          {imageError ? (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">
              Image not available
            </div>
          ) : (
            <Image
              alt={cert.name}
              className="object-cover transition-opacity hover:opacity-100"
              fill
              onError={handleImageError}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              src={cert.image}
            />
          )}
        </div>
        <h3 className="mb-1 font-semibold text-foreground">{cert.name}</h3>
        <p className="mb-4 text-muted-foreground text-sm">
          {cert.organization}
        </p>
        <div className="line-clamp-3 text-muted-foreground/80 text-xs">
          <Markdown>{cert.description}</Markdown>
        </div>
        <span className="absolute top-6 right-6 rounded border border-border bg-background/80 px-2 py-1 font-mono text-xs backdrop-blur">
          {cert.date}
        </span>
      </div>
    </Card3D>
  );
};
