"use client";

import { useGSAP } from "@gsap/react";
import gsapCore from "gsap";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";

import { BorderedImage } from "@/components/shared/bordered-image";
import { Markdown } from "@/components/shared/markdown";
import { ShiftButton } from "@/components/shared/shift-button";
import { ROUTES } from "@/lib/constants/navigation";
import type { Project } from "@/lib/types";

interface ProjectHeroProps {
  project: Project;
}

export const ProjectHero = ({ project }: ProjectHeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [heroImageError, setHeroImageError] = useState(false);
  const [projectTitle] = project.title.split(" - ");
  const handleHeroImageError = useCallback(() => {
    setHeroImageError(true);
  }, []);

  useGSAP(
    () => {
      // Set initial states
      gsapCore.set(".hero-back", { autoAlpha: 0, x: -20 });
      gsapCore.set(".hero-logo", { autoAlpha: 0, scale: 0.8 });
      gsapCore.set(".hero-title", { autoAlpha: 0, y: 20 });
      gsapCore.set(".hero-header-item", { autoAlpha: 0, y: 20 });
      gsapCore.set(".hero-visual", {
        autoAlpha: 0,
        scale: 0.98,
        transformOrigin: "center bottom",
      });

      const tl = gsapCore.timeline({ defaults: { ease: "power3.out" } });

      // Back button
      tl.to(".hero-back", {
        autoAlpha: 1,
        duration: 0.6,
        x: 0,
      });

      // Logo & Title
      tl.to(
        [".hero-logo", ".hero-title"],
        {
          autoAlpha: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          scale: 1,
          stagger: 0.1,
          y: 0,
        },
        "-=0.4"
      );

      // Rest of header items
      tl.to(
        ".hero-header-item",
        {
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.1,
          y: 0,
        },
        "-=0.6"
      );

      // Hero visual
      tl.to(
        ".hero-visual",
        {
          autoAlpha: 1,
          duration: 1.2,
          ease: "expo.out",
          scale: 1,
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
        aria-label="Back to portfolio"
        className="hero-back group mb-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/80 px-3 py-2 text-muted-foreground shadow-sm ring-1 ring-black/5 backdrop-blur-md transition-all duration-300 hover:border-border hover:bg-secondary hover:text-foreground"
        href={ROUTES.HOME + ROUTES.PROJECTS}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-background/80 text-foreground shadow-inner ring-1 ring-border/40 transition-transform duration-300 group-hover:-translate-x-0.5">
          <ArrowLeft className="h-4 w-4" />
        </span>
        <span className="pr-1 font-medium text-sm tracking-tight">Back</span>
      </Link>

      {/* Header Section */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-4">
          {project.logo && (
            <BorderedImage
              alt={`${project.title} logo`}
              backgroundColor={project.logoStyle?.backgroundColor as string}
              colorDark={project.logoStyle?.colorDark}
              colorLight={project.logoStyle?.colorLight}
              containerClassName="hero-logo h-12 w-12 shrink-0"
              height={48}
              imageClassName="p-2 object-contain"
              src={project.logo}
              style={{ transform: "scale(1.5)" }}
              width={48}
            />
          )}
          <h1 className="hero-title text-balance font-bold text-3xl tracking-tight sm:text-4xl">
            {projectTitle}
          </h1>
        </div>
        <div className="hero-header-item mb-6 max-w-2xl text-pretty text-base text-muted-foreground leading-relaxed sm:text-lg">
          <Markdown>{project.description}</Markdown>
        </div>

        {(project.href || project.github) && (
          <div className="hero-header-item flex flex-wrap gap-3">
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
        )}
      </div>

      {/* Hero Visual (Hero Image) */}
      {project.hero_image && (
        <div className="hero-visual group w-full overflow-hidden rounded-2xl border border-border/50 bg-secondary shadow-lg">
          <div className="relative aspect-video w-full">
            {heroImageError ? (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                Hero image not available
              </div>
            ) : (
              <Image
                alt={`${project.title} hero`}
                className="object-cover"
                fill
                onError={handleHeroImageError}
                priority
                sizes="100vw"
                src={project.hero_image}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
