"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ROUTES } from "@/constants/navigation";
import { TECH_STACK } from "@/constants/tech-stack";
import type { Project } from "@/types";
import { Magnetic } from "../effects/magnetic";
import { BorderedImage } from "./bordered-image";

export const ProjectCard = ({ project }: { project: Project }) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const { contextSafe } = useGSAP({ scope: linkRef });

  const handleMouseMove = contextSafe(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!linkRef.current) {
        return;
      }
      const { left, top, width, height } =
        linkRef.current.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      const xPercent = (x / width - 0.5) * 2; // -1 to 1
      const yPercent = (y / height - 0.5) * 2; // -1 to 1

      gsap.to(linkRef.current, {
        rotateY: xPercent * 5,
        rotateX: -yPercent * 5,
        transformPerspective: 1000,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  );

  const handleMouseLeave = contextSafe(() => {
    gsap.to(linkRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  });

  return (
    <Link
      aria-label={`View project: ${project.title}`}
      className="project-card-item group block w-full cursor-pointer rounded-2xl bg-card p-2 shadow-sm transition-all duration-500 hover:shadow-2xl sm:p-3"
      href={ROUTES.PROJECT_DETAIL(project.id)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={linkRef}
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
              {project.title.split(" - ")[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Content Part (Matching reference: Title - Subtitle) */}
      <div className="mt-4 flex flex-col items-center gap-2 px-2 pb-2">
        <h3 className="font-medium text-foreground text-md">
          {project.title.split(" - ")[0]}
          {project.title.split(" - ")[1] && (
            <span className="text-muted-foreground">
              {" — "}
              {project.title.split(" - ")[1]}
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
  );
};
