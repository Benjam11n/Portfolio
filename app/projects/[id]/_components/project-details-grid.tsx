"use client";

import { Maximize2 } from "lucide-react";
import { useState } from "react";
import type { Project } from "@/constants";
import { cn } from "@/lib/utils";
import { FullscreenMedia } from "./fullscreen-media";

type ProjectDetailsGridProps = {
  project: Project;
};

export const ProjectDetailsGrid = ({ project }: ProjectDetailsGridProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const details = [
    { label: "Client", value: project.client, uppercase: false },
    { label: "Year", value: project.year, uppercase: true },
    { label: "Services", value: project.services, uppercase: true },
    { label: "Location", value: project.location, uppercase: true },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {details.map((detail) => (
          <div
            className="rounded-xl border border-border/40 bg-card p-3 shadow-sm"
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
      {/* // todo: abstract out this overlay and use it in prject hero as well. */}
      {/* Project Visual Below Grid */}
      <button
        className="group relative mt-8 w-full cursor-zoom-in overflow-hidden rounded-xl bg-card p-3 shadow-sm"
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
            src={project.texture}
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/10">
            <div className="translate-y-4 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
              <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 font-medium text-black text-sm shadow-lg backdrop-blur-sm">
                <Maximize2 className="h-4 w-4" />
                Click to expand
              </div>
            </div>
          </div>
        </div>
      </button>
      <FullscreenMedia
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        src={project.texture || ""}
        type="video"
      />
    </div>
  );
};
