"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Maximize2 } from "lucide-react";
import { useRef, useState } from "react";
import { MediaPreviewOverlay } from "@/components/ui/media-preview-overlay";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";
import { FullscreenMedia } from "./fullscreen-media";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ProjectDetailsGridProps = {
  project: Project;
};

export const ProjectDetailsGrid = ({ project }: ProjectDetailsGridProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const details = [
    { label: "Client", value: project.client, uppercase: false },
    { label: "Year", value: project.year, uppercase: true },
    { label: "Services", value: project.services, uppercase: true },
    { label: "Location", value: project.location, uppercase: true },
  ];

  useGSAP(
    () => {
      // Set initial states
      gsap.set(".details-card", { scale: 0.9, autoAlpha: 0, y: 20 });
      gsap.set(".details-video", { autoAlpha: 0, scale: 0.95 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "power3.out" },
      });

      // Cards stagger pop
      tl.to(".details-card", {
        scale: 1,
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
      });

      // Video scale/fade
      tl.to(
        ".details-video",
        {
          autoAlpha: 1,
          scale: 1,
          duration: 1,
          ease: "back.out(1.5)",
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
          onClick={() => setIsFullscreen(true)}
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
        onClose={() => setIsFullscreen(false)}
        src={project.video_overview || ""}
        type="video"
      />
    </div>
  );
};
