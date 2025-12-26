"use client";

import Image from "next/image";
import Link from "next/link";
import { BorderedImage } from "@/components/bordered-image";
import { Magnetic } from "@/components/magnetic";
import type { PROJECTS } from "@/constants";

type Project = (typeof PROJECTS)[keyof typeof PROJECTS];

export const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="project-card-item group block w-full cursor-pointer rounded-xl bg-card p-2 shadow-sm transition-all duration-300 hover:scale-102 hover:shadow-lg sm:p-2 sm:pb-4">
      <Link href={`/projects/${project.id}`}>
        {/* Visual Part */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-secondary">
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

          {project.logo && (
            <div className="absolute top-4 left-4">
              <Magnetic>
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
              </Magnetic>
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

          {!!project.techStack.length && (
            <div className="flex flex-wrap items-center justify-center gap-2 pb-2">
              {project.techStack.map((tech) => (
                <Magnetic key={tech.name}>
                  <div className="cursor-pointer">
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
                </Magnetic>
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};
