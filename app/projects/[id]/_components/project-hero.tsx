"use client";

import { ArrowLeft, Maximize2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShiftButton } from "@/components/shift-button";
import type { Project } from "@/constants";
import { FullscreenMedia } from "./fullscreen-media";

type ProjectHeroProps = {
  project: Project;
};

export const ProjectHero = ({ project }: ProjectHeroProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="w-full">
      {/* Back Button */}
      <Link
        className="group mb-8 inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-black"
        href="/#projects"
      >
        <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
      </Link>

      {/* Header Section */}
      <div className="mb-12">
        <h1 className="mb-4 font-bold text-lg tracking-tight sm:text-5xl md:text-xl">
          {project.title.split(" - ")[0]}
        </h1>
        <p className="mb-8 max-w-md text-muted-foreground text-sm leading-relaxed md:text-lg">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-4">
          {project.href && (
            <ShiftButton
              href={project.href}
              rel="noopener noreferrer"
              target="_blank"
            >
              Live Site
            </ShiftButton>
          )}

          {project.github && (
            <ShiftButton
              href={project.github}
              rel="noopener noreferrer"
              target="_blank"
              variant="secondary"
            >
              Source Code
            </ShiftButton>
          )}
        </div>
      </div>

      {/* Hero Visual (Spotlight) */}
      <button
        className="group relative w-full cursor-zoom-in overflow-hidden rounded-xl bg-card p-3 shadow-sm"
        onClick={() => setIsFullscreen(true)}
        type="button"
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <Image
            alt={`${project.title} spotlight`}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            fill
            priority
            src={project.spotlight}
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
        src={project.spotlight}
        type="image"
      />
    </div>
  );
};
