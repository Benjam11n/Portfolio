"use client";

import { useGSAP } from "@gsap/react";
import gsapCore from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Maximize2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { MediaPreviewOverlay } from "@/components/ui/media-preview-overlay";
import type { Project } from "@/lib/types/index.ts";
import { cn } from "@/lib/utils";

import { FullscreenMedia } from "./fullscreen-media";

if (typeof window !== "undefined") {
  gsapCore.registerPlugin(ScrollTrigger);
}

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
    { label: "Client", uppercase: false, value: project.client },
    { label: "Year", uppercase: false, value: project.year },
    { label: "Services", uppercase: false, value: project.services },
    { label: "Location", uppercase: false, value: project.location },
  ];

  useGSAP(
    () => {
      // Set initial states
      gsapCore.set(".details-card", { autoAlpha: 0, scale: 0.9, y: 20 });
      gsapCore.set(".details-video", { autoAlpha: 0, scale: 0.95 });

      const tl = gsapCore.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          start: "top 85%",
          toggleActions: "play none none none",
          trigger: containerRef.current,
        },
      });

      // Cards stagger pop
      tl.to(".details-card", {
        autoAlpha: 1,
        duration: 0.6,
        scale: 1,
        stagger: 0.1,
        y: 0,
      });

      // Video scale/fade
      tl.to(
        ".details-video",
        {
          autoAlpha: 1,
          duration: 1,
          ease: "back.out(1.5)",
          scale: 1,
        },
        "-=0.4"
      );
    },
    { scope: containerRef }
  );

  return (
    <div className="space-y-4" ref={containerRef}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {details.map((detail) => (
          <div
            className="details-card rounded-xl border border-border/40 bg-card p-3 shadow-sm"
            key={detail.label}
          >
            <span
              className={cn(
                "mb-2 block font-semibold text-muted-foreground text-sm tracking-wider",
                detail.uppercase && "uppercase"
              )}
            >
              {detail.label}
            </span>
            <span className="block font-semibold text-foreground text-md">
              {detail.value}
            </span>
          </div>
        ))}
      </div>

      {/* Project Visual Below Grid */}
      {project.video_overview && (
        <button
          className="details-video group relative mt-8 w-full cursor-zoom-in overflow-hidden rounded-xl bg-card p-3 shadow-sm"
          onClick={handleOpenFullscreen}
          type="button"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-xl">
            <video
              autoPlay
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              loop
              muted
              playsInline
              src={project.video_overview}
            />

            <MediaPreviewOverlay icon={<Maximize2 className="h-4 w-4" />} />
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
