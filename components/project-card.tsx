"use client";

import Image from "next/image";
import { BorderedImage } from "@/components/ui/bordered-image";
import { ShiftButton } from "@/components/ui/shift-button";
import type { PROJECTS } from "@/constants";

type Project = (typeof PROJECTS)[keyof typeof PROJECTS];

type ProjectCardProps = {
  project: Project;
  onClick: () => void;
};

export const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  return (
    <button
      className="group w-full cursor-pointer rounded-2xl bg-card p-2 shadow-sm transition-all duration-300 hover:shadow-lg sm:p-5"
      onClick={onClick}
      type="button"
    >
      {/* Visual Part */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-secondary">
        {project.texture ? (
          <video
            autoPlay
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loop
            muted
            playsInline
            src={project.texture}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            No Preview
          </div>
        )}

        {/* Optional Logo */}
        {project.logo && (
          <div className="absolute top-4 left-4">
            <div
              className="rounded-xl bg-card/90 p-2 shadow-sm backdrop-blur-sm"
              style={project.logoStyle}
            >
              <Image
                alt="logo"
                className="h-6 w-6 object-contain"
                height={24}
                src={project.logo}
                width={24}
              />
            </div>
          </div>
        )}
      </div>

      {/* Content Part */}
      <div className="mt-4 flex flex-col items-center gap-4 px-2">
        <h3 className="font-bold text-foreground text-xl leading-snug">
          {project.title}
        </h3>

        {/* Tech Stack - Row of Bordered Images */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {project.techStack.map((tech) => (
            <div key={tech.name}>
              <BorderedImage
                alt={tech.name}
                colorDark={tech.colorDark}
                colorLight={tech.colorLight}
                containerClassName="h-10 w-10 shrink-0"
                height={20}
                imageClassName="p-[6px]"
                src={tech.path}
                width={20}
              />
            </div>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          {project.href && (
            <ShiftButton
              className="h-8 border border-transparent bg-gray-100/50 px-3 text-xs hover:border-gray-200 hover:bg-gray-100"
              href={project.href}
              target="_blank"
              variant="secondary"
            >
              Visit
            </ShiftButton>
          )}
          {project.github && (
            <ShiftButton
              className="h-8 border border-transparent bg-gray-100/50 px-3 text-xs hover:border-gray-200 hover:bg-gray-100"
              href={project.github}
              target="_blank"
              variant="secondary"
            >
              GitHub
            </ShiftButton>
          )}
        </div>
      </div>
    </button>
  );
};
