"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowLeft, ExternalLink, Github, Maximize2 } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { ShiftButton } from "@/components/shared/shift-button";
import { ROUTES } from "@/constants/navigation";
import type { Project } from "@/types";
import { FullscreenMedia } from "./fullscreen-media";

type ProjectHeroProps = {
  project: Project;
};

export const ProjectHero = ({ project }: ProjectHeroProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Set initial states
      gsap.set(".hero-back", { x: -20, autoAlpha: 0 });
      gsap.set(".hero-header-item", { y: 40, autoAlpha: 0 });
      gsap.set(".hero-visual", { scale: 0.95, autoAlpha: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Back button
      tl.to(".hero-back", {
        x: 0,
        autoAlpha: 1,
        duration: 0.6,
      });

      // Header items
      tl.to(
        ".hero-header-item",
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.1,
        },
        "-=0.4"
      );

      // Hero visual
      tl.to(
        ".hero-visual",
        {
          scale: 1,
          autoAlpha: 1,
          duration: 1,
          ease: "back.out(1.7)",
        },
        "-=0.6"
      );
    },
    { scope: containerRef }
  );

  return (
    <div className="w-full" ref={containerRef}>
      {/* Back Button */}
      <Link
        className="hero-back group mb-8 inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-black"
        href={ROUTES.HOME + ROUTES.PROJECTS}
      >
        <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
      </Link>

      {/* Header Section */}
      <div className="mb-12">
        <h1 className="hero-header-item mb-4 font-bold text-lg tracking-tight sm:text-5xl md:text-xl">
          {project.title.split(" - ")[0]}
        </h1>
        <p className="hero-header-item mb-8 max-w-md text-muted-foreground text-sm leading-relaxed md:text-lg">
          {project.description}
        </p>

        <div className="hero-header-item flex flex-wrap gap-4">
          {project.href && (
            <ShiftButton
              href={project.href}
              icon={<ExternalLink className="h-4 w-4" />}
              rel="noopener noreferrer"
              target="_blank"
            >
              Live Site
            </ShiftButton>
          )}

          {project.github && (
            <ShiftButton
              href={project.github}
              icon={<Github className="h-4 w-4" />}
              rel="noopener noreferrer"
              target="_blank"
              variant="secondary"
            >
              Source Code
            </ShiftButton>
          )}
        </div>
      </div>

      {/* Hero Visual (Video Overview) */}
      {project.video_overview && (
        <button
          className="hero-visual group relative w-full cursor-zoom-in overflow-hidden rounded-xl bg-card p-3 shadow-sm"
          onClick={() => setIsFullscreen(true)}
          type="button"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-secondary">
            <video
              autoPlay
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              loop
              muted
              playsInline
              src={project.video_overview}
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
      )}

      {project.video_overview && (
        <FullscreenMedia
          isOpen={isFullscreen}
          onClose={() => setIsFullscreen(false)}
          src={project.video_overview}
          type="video"
        />
      )}
    </div>
  );
};
