"use client";

import Image from "next/image";
import { BorderedImage } from "@/components/bordered-image";
import type { PROJECTS } from "@/constants";

type Project = (typeof PROJECTS)[keyof typeof PROJECTS];

import Link from "next/link";

export const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <Link
      className="group block w-full cursor-pointer rounded-2xl bg-card p-2 shadow-sm transition-all duration-300 hover:shadow-lg sm:p-2 sm:pb-4"
      href={`/projects/${project.id}`}
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
              className="rounded-2xl bg-card/90 p-2 shadow-sm backdrop-blur-sm"
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
        <h3 className="font-semibold text-foreground text-lg leading-snug">
          {project.title.split(" - ")[0]}
          {project.title.split(" - ")[1] && (
            <span className="font-semibold text-muted-foreground">
              {" - "}
              {project.title.split(" - ")[1]}
            </span>
          )}
        </h3>

        {/* Tech Stack - Row of Bordered Images */}
        {!!project.techStack.length && (
          <div className="flex flex-wrap items-center justify-center gap-2 pb-2">
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
        )}
      </div>
    </Link>
  );
};
