"use client";

import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { Card3D } from "@/components/effects/card-3d";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ROUTES } from "@/lib/constants/navigation";
import { TECH_STACK } from "@/lib/constants/tech-stack";
import { useMobileDetection } from "@/lib/hooks/use-mobile-detection";
import type { Project } from "@/lib/types";
import { Magnetic } from "../effects/magnetic";
import { BorderedImage } from "./bordered-image";

type ProjectCardProps = {
  project: Project;
};

export const ProjectCard = memo(({ project }: ProjectCardProps) => {
  const isMobile = useMobileDetection();

  // Split title once for efficiency and safety
  const [titleMain, titleSub] = project.title.split(" - ");

  return (
    <Card3D
      className="p-2 shadow-sm sm:p-3"
      glare={!isMobile}
      parallaxIntensity={0}
      rotationIntensity={isMobile ? 0 : 5}
      thickness={10}
    >
      <Link
        aria-label={`View project: ${project.title}`}
        className="project-card-item group block w-full cursor-pointer"
        href={ROUTES.PROJECT_DETAIL(project.id)}
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

          {project.video_overview && (
            <video
              autoPlay
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              loop
              muted
              playsInline
              src={project.video_overview}
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
              {project.techStack.map((techName) => {
                const tech = TECH_STACK.find(
                  (t) => t.name.toLowerCase() === techName.toLowerCase()
                );
                if (!tech) {
                  return null;
                }

                return (
                  <Magnetic key={techName}>
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
