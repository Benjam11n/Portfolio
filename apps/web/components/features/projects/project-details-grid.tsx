"use client";

import { Maximize2 } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";

import { FullscreenMedia } from "@/components/features/projects/fullscreen-media";
import { Card3D } from "@/components/shared/effects/card-3d";
import { MediaPreviewOverlay } from "@/components/ui/media-preview-overlay";
import { useScrollReveal } from "@/lib/hooks/animation/use-scroll-reveal";
import type { RevealStep } from "@/lib/hooks/animation/use-scroll-reveal";
import type { Project } from "@/lib/types/index.ts";
import { cn } from "@/lib/utils";

interface ProjectDetailsGridProps {
  project: Project;
}

export const ProjectDetailsGrid = ({ project }: ProjectDetailsGridProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleOpenFullscreen = useCallback(() => {
    setIsFullscreen(true);
  }, []);
  const handleCloseFullscreen = useCallback(() => {
    setIsFullscreen(false);
  }, []);

  const details = [
    { label: "Year", uppercase: false, value: project.year },
    { label: "Location", uppercase: false, value: project.location },
  ];

  const revealSteps = useMemo<RevealStep[]>(
    () => [
      {
        from: { autoAlpha: 0, scale: 0.98, y: 16 },
        target: ".details-card",
        to: {
          autoAlpha: 1,
          duration: 0.6,
          scale: 1,
          stagger: 0.1,
          y: 0,
        },
      },
      {
        from: { autoAlpha: 0, scale: 1.02 },
        position: "-=0.4",
        target: ".details-video",
        to: { autoAlpha: 1, duration: 1, ease: "back.out(1.5)", scale: 1 },
      },
    ],
    []
  );
  useScrollReveal(containerRef, revealSteps);

  return (
    <div className="space-y-4" ref={containerRef}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {details.map((detail) => (
          <Card3D
            className="h-full border border-border/50 bg-card p-4 shadow-sm transition-colors"
            containerClassName="details-card"
            key={detail.label}
            variant="compact"
          >
            <span
              className={cn(
                "mb-2 block font-bold font-mono text-muted-foreground text-xs uppercase tracking-[0.2em]",
                detail.uppercase && "uppercase"
              )}
            >
              {detail.label}
            </span>
            <span className="block font-semibold text-foreground text-md">
              {detail.value}
            </span>
          </Card3D>
        ))}
      </div>

      {/* Project Visual Below Grid */}
      {project.video_overview && (
        <button
          aria-label={`Open ${project.title} video preview fullscreen`}
          className="details-video group relative mt-8 w-full cursor-zoom-in overflow-hidden rounded-xl bg-card p-3 shadow-sm"
          onClick={handleOpenFullscreen}
          type="button"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-xl">
            <video
              aria-label={`${project.title} video preview`}
              autoPlay
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              loop
              muted
              playsInline
              src={project.video_overview}
            />

            <MediaPreviewOverlay icon={<Maximize2 className="size-4" />} />
          </div>
        </button>
      )}

      <FullscreenMedia
        isOpen={isFullscreen}
        onClose={handleCloseFullscreen}
        src={project.video_overview || ""}
        type="video"
      />
    </div>
  );
};
