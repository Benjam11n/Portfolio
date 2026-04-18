"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useCallback, useEffect, useRef, useState } from "react";

import { Card3D } from "@/components/effects/card-3d";
import { Magnetic } from "@/components/effects/magnetic";
import { BorderedImage } from "@/components/shared/bordered-image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ROUTES } from "@/lib/constants/navigation";
import { TECH_STACK_BY_ID } from "@/lib/constants/tech-stack";
import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";
import { useMobileDetection } from "@/lib/hooks/utils/use-mobile-detection";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = memo(({ project }: ProjectCardProps) => {
  const isMobile = useMobileDetection();
  const prefersReducedMotion = usePrefersReducedMotion();
  const previewTimeoutRef = useRef<number | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const [hasFineHover, setHasFineHover] = useState(false);
  const [shouldLoadPreview, setShouldLoadPreview] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  // Split title once for efficiency and safety
  const [titleMain, titleSub] = project.title.split(" - ");
  const canPreview =
    Boolean(project.preview_video) &&
    !isMobile &&
    !prefersReducedMotion &&
    hasFineHover;
  const previewPoster = project.preview_poster ?? project.hero_image;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateMatch = (event?: MediaQueryListEvent) => {
      setHasFineHover(event?.matches ?? mediaQuery.matches);
    };

    updateMatch();
    mediaQuery.addEventListener("change", updateMatch);

    return () => {
      mediaQuery.removeEventListener("change", updateMatch);
    };
  }, []);

  useEffect(
    () => () => {
      if (previewTimeoutRef.current) {
        window.clearTimeout(previewTimeoutRef.current);
      }
    },
    []
  );

  const clearPreviewIntentTimeout = useCallback(() => {
    if (previewTimeoutRef.current) {
      window.clearTimeout(previewTimeoutRef.current);
      previewTimeoutRef.current = null;
    }
  }, []);

  const tryPlayPreview = useCallback(async () => {
    const video = previewVideoRef.current;
    if (!video) {
      return;
    }

    try {
      await video.play();
    } catch {
      // Ignore autoplay failures and keep the poster visible.
    }
  }, []);

  const startPreview = useCallback(() => {
    if (!canPreview) {
      return;
    }

    clearPreviewIntentTimeout();
    previewTimeoutRef.current = window.setTimeout(() => {
      setShouldLoadPreview(true);
      setIsPreviewVisible(true);
    }, 200);
  }, [canPreview, clearPreviewIntentTimeout]);

  const stopPreview = useCallback(() => {
    clearPreviewIntentTimeout();
    setIsPreviewVisible(false);

    const video = previewVideoRef.current;
    if (!video) {
      return;
    }

    video.pause();
    video.currentTime = 0;
  }, [clearPreviewIntentTimeout]);

  const handlePreviewLoadedData = useCallback(() => {
    if (!isPreviewVisible) {
      return;
    }

    tryPlayPreview();
  }, [isPreviewVisible, tryPlayPreview]);

  useEffect(() => {
    if (!canPreview || !shouldLoadPreview || !isPreviewVisible) {
      return;
    }

    tryPlayPreview();
  }, [canPreview, isPreviewVisible, shouldLoadPreview, tryPlayPreview]);

  return (
    <Card3D
      className="p-2 shadow-sm sm:p-3"
      glare={!isMobile}
      parallaxIntensity={0}
      rotationIntensity={isMobile ? 0 : 3}
      thickness={10}
    >
      <Link
        aria-label={`View project: ${project.title}`}
        className="project-card-item group block w-full cursor-pointer"
        data-hover-cursor=""
        data-hover-cursor-icon="arrow-up-right"
        data-hover-cursor-label="View project"
        href={ROUTES.PROJECT_DETAIL(project.id)}
        onBlur={stopPreview}
        onFocus={startPreview}
        onMouseEnter={startPreview}
        onMouseLeave={stopPreview}
      >
        {/* Visual Part */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-secondary">
          {project.hero_image && (
            <Image
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              src={project.hero_image}
            />
          )}

          {shouldLoadPreview && project.preview_video && (
            <video
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
                isPreviewVisible ? "opacity-100" : "opacity-0"
              )}
              loop
              muted
              onLoadedData={handlePreviewLoadedData}
              playsInline
              poster={previewPoster}
              preload="metadata"
              ref={previewVideoRef}
              src={project.preview_video}
            />
          )}

          {previewPoster && shouldLoadPreview && (
            <Image
              alt=""
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
                isPreviewVisible ? "opacity-0" : "opacity-100"
              )}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              src={previewPoster}
            />
          )}

          {/* Centered Logo and Name Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/5 transition-colors group-hover:bg-black/20">
            <div className="flex items-center gap-3 rounded-2xl bg-black/10 px-6 py-3 backdrop-blur-md transition-transform duration-500 group-hover:scale-110">
              {project.logo && (
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl p-1.5 shadow-lg"
                  style={project.logoStyle}
                >
                  <Image
                    alt="logo"
                    className="h-full w-full object-contain"
                    height={32}
                    src={project.logo}
                    width={32}
                  />
                </div>
              )}
              <span className="font-bold text-2xl text-white tracking-tight drop-shadow-md">
                {titleMain}
              </span>
            </div>
          </div>
        </div>

        {/* Content Part (Matching reference: Title - Subtitle) */}
        <div className="mt-4 flex flex-col items-center gap-2 px-2 pb-2">
          <h3 className="font-medium text-foreground text-md">
            {titleMain}
            {titleSub && (
              <span className="text-muted-foreground">
                {" — "}
                {titleSub}
              </span>
            )}
          </h3>

          {!!project.techStack.length && (
            <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
              {project.techStack.map((techId) => {
                const tech = TECH_STACK_BY_ID[techId];
                if (!tech) {
                  return null;
                }

                return (
                  <Magnetic key={techId}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="cursor-pointer">
                          <BorderedImage
                            alt={tech.name}
                            colorDark={tech.colorDark}
                            colorLight={tech.colorLight}
                            containerClassName="h-10 w-10 shrink-0"
                            height={20}
                            imageClassName="p-[6px]"
                            src={tech.icon}
                            width={20}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{tech.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </Magnetic>
                );
              })}
            </div>
          )}
        </div>
      </Link>
    </Card3D>
  );
});

ProjectCard.displayName = "ProjectCard";
