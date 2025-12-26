"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { ShiftButton } from "@/components/ui/shift-button";
import type { PROJECTS } from "@/constants";

type Project = (typeof PROJECTS)[keyof typeof PROJECTS];

type ProjectDetailsProps = {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
};

export const ProjectDetails = ({
  project,
  isOpen,
  onClose,
}: ProjectDetailsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (isOpen) {
        // Open Animation
        gsap.to(containerRef.current, {
          display: "block",
          duration: 0,
        });
        gsap.to(overlayRef.current, {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        });
        gsap.fromTo(
          panelRef.current,
          { x: "100%" },
          { x: "0%", duration: 0.5, ease: "power3.out" }
        );
      } else {
        // Close Animation
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
        });
        gsap.to(panelRef.current, {
          x: "100%",
          duration: 0.4,
          ease: "power3.in",
          onComplete: () => {
            if (containerRef.current) {
              containerRef.current.style.display = "none";
            }
          },
        });
      }
    },
    { dependencies: [isOpen], scope: containerRef }
  );

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!project) {
    return null;
  }

  return (
    <div
      aria-hidden={!isOpen}
      className="fixed inset-0 z-50 hidden"
      ref={containerRef}
    >
      {/* Backdrop */}
      <button
        aria-label="Close modal"
        className="absolute inset-0 bg-black/40 opacity-0 backdrop-blur-sm"
        onClick={onClose}
        ref={overlayRef}
        type="button"
      />

      {/* Side Panel */}
      <div
        className="absolute top-0 right-0 h-full w-full max-w-2xl translate-x-full overflow-y-auto bg-background shadow-2xl"
        ref={panelRef}
      >
        <div className="relative p-6 sm:p-10">
          {/* Close Button */}
          <button
            aria-label="Close modal"
            className="absolute top-6 right-6 z-10 rounded-full bg-muted p-2 text-foreground transition-colors hover:bg-accent"
            onClick={onClose}
            type="button"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Visual Header */}
          <div className="relative mb-8 aspect-video overflow-hidden rounded-2xl bg-secondary">
            {project.texture ? (
              <video
                autoPlay
                className="h-full w-full object-cover"
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
            {/* Logo Overlay */}
            {project.logo && (
              <div className="absolute top-4 left-4">
                <div
                  className="rounded-xl bg-card/90 p-2 shadow-sm backdrop-blur-sm"
                  style={project.logoStyle}
                >
                  <Image
                    alt="logo"
                    className="h-8 w-8 object-contain"
                    height={32}
                    src={project.logo}
                    width={32}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <h2 className="mb-2 font-bold text-3xl text-foreground">
            {project.title}
          </h2>
          <div className="mb-6 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                className="rounded-full border border-border bg-secondary px-3 py-1 font-medium text-secondary-foreground text-xs"
                key={tech.name}
              >
                {tech.name}
              </span>
            ))}
          </div>

          <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
            {project.description}
          </p>

          <div className="flex gap-4">
            {project.href && (
              <ShiftButton
                className="w-full sm:w-auto"
                href={project.href}
                target="_blank"
                variant="primary"
              >
                Visit Website
              </ShiftButton>
            )}
            {project.github && (
              <ShiftButton
                className="w-full sm:w-auto"
                href={project.github}
                target="_blank"
                variant="secondary"
              >
                View Code
              </ShiftButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
