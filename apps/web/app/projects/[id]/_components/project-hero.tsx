"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
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

      {/* Hero Visual (Hero Image) */}
      {project.hero_image && (
        <div className="hero-visual mb-12 w-full overflow-hidden rounded-2xl bg-secondary shadow-lg">
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
                src={project.hero_image}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
