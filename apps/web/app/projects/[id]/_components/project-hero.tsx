"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { BorderedImage } from "@/components/shared/bordered-image";
import { ShiftButton } from "@/components/shared/shift-button";
import { ROUTES } from "@/constants/navigation";
import type { Project } from "@/types";

type ProjectHeroProps = {
  project: Project;
};

export const ProjectHero = ({ project }: ProjectHeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [heroImageError, setHeroImageError] = useState(false);

  useGSAP(
    () => {
      // Set initial states
      gsap.set(".hero-back", { x: -20, autoAlpha: 0 });
      gsap.set(".hero-logo", { scale: 0.8, autoAlpha: 0 });
      gsap.set(".hero-title", { y: 20, autoAlpha: 0 });
      gsap.set(".hero-header-item", { y: 20, autoAlpha: 0 });
      gsap.set(".hero-visual", {
        scale: 0.98,
        autoAlpha: 0,
        transformOrigin: "center bottom",
      });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Back button
      tl.to(".hero-back", {
        x: 0,
        autoAlpha: 1,
        duration: 0.6,
      });

      // Logo & Title
      tl.to(
        [".hero-logo", ".hero-title"],
        {
          y: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.7)",
        },
        "-=0.4"
      );

      // Rest of header items
      tl.to(
        ".hero-header-item",
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.1,
        },
        "-=0.6"
      );

      // Hero visual
      tl.to(
        ".hero-visual",
        {
          scale: 1,
          autoAlpha: 1,
          duration: 1.2,
          ease: "expo.out",
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
        className="hero-back group mb-8 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        href={ROUTES.HOME + ROUTES.PROJECTS}
      >
        <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
      </Link>

      {/* Header Section */}
      <div className="mb-12">
        <div className="mb-6 flex items-center gap-4">
          {project.logo && (
            <BorderedImage
              alt={`${project.title} logo`}
              backgroundColor={project.logoStyle?.backgroundColor as string}
              containerClassName="hero-logo h-12 w-12 shrink-0"
              height={48}
              imageClassName="p-2"
              src={project.logo}
              width={48}
            />
          )}
          <h1 className="hero-title text-balance font-bold text-3xl tracking-tight sm:text-5xl">
            {project.title.split(" - ")[0]}
          </h1>
        </div>
        <p className="hero-header-item mb-8 max-w-2xl text-pretty text-lg text-muted-foreground leading-relaxed">
          {project.description}
        </p>

        {project.href ||
          (project.github && (
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
          ))}
      </div>

      {/* Hero Visual (Hero Image) */}
      {project.hero_image && (
        <div className="hero-visual group mb-12 w-full overflow-hidden rounded-2xl border border-border/50 bg-secondary shadow-lg transition-transform duration-500 hover:scale-[1.01]">
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
                onError={() => setHeroImageError(true)}
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
