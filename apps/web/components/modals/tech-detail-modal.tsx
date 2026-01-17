"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { X } from "lucide-react";
import { useRef } from "react";
import { BorderedImage } from "@/components/shared/bordered-image";
import { RelatedProjectsList } from "@/components/shared/related-projects-list";
import { TechProficiencyIndicator } from "@/components/shared/tech-proficiency-indicator";
import type { TechStack } from "@/lib/types";

type TechDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  tech: TechStack;
};

export const TechDetailModal = ({
  isOpen,
  onClose,
  tech,
}: TechDetailModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!isOpen) {
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      // Initial states
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(contentRef.current, { scale: 0.9, y: 40, opacity: 0 });
      gsap.set(headerRef.current, { y: -20, opacity: 0 });
      gsap.set(bodyRef.current, { y: 20, opacity: 0 });

      // Animation sequence
      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
      })
        .to(
          contentRef.current,
          {
            scale: 1,
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(1.7)",
          },
          "-=0.1"
        )
        .to(
          headerRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
          },
          "-=0.3"
        )
        .to(
          bodyRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
          },
          "-=0.2"
        );
    },
    { scope: containerRef, dependencies: [isOpen] }
  );

  const handleClose = () => {
    const tl = gsap.timeline({
      onComplete: onClose,
    });

    tl.to(bodyRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.3,
    })
      .to(
        headerRef.current,
        {
          y: -20,
          opacity: 0,
          duration: 0.3,
        },
        "-=0.2"
      )
      .to(
        contentRef.current,
        {
          scale: 0.9,
          y: 40,
          opacity: 0,
          duration: 0.4,
        },
        "-=0.2"
      )
      .to(
        overlayRef.current,
        {
          opacity: 0,
          duration: 0.3,
        },
        "-=0.2"
      );
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div ref={containerRef}>
      {/* Overlay */}
      <button
        aria-label="Close tech detail modal"
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            handleClose();
          }
        }}
        ref={overlayRef}
        type="button"
      />

      {/* Modal Content */}
      <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          aria-labelledby={`tech-modal-title-${tech.name}`}
          aria-modal="true"
          className="pointer-events-auto relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          ref={contentRef}
          role="dialog"
        >
          {/* Header */}
          <div
            className="flex items-start justify-between border-border border-b p-6"
            ref={headerRef}
          >
            <div className="flex items-center gap-4">
              <BorderedImage
                alt={tech.name}
                colorDark={tech.colorDark}
                colorLight={tech.colorLight}
                containerClassName="h-16 w-16 shrink-0"
                height={64}
                imageClassName="p-3"
                src={tech.icon}
                width={64}
              />
              <div>
                <h2
                  className="font-bold text-2xl text-foreground"
                  id={`tech-modal-title-${tech.name}`}
                >
                  {tech.name}
                </h2>
                <p className="font-medium text-muted-foreground text-sm">
                  {tech.category}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              aria-label="Close modal"
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-muted"
              onClick={handleClose}
              type="button"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 space-y-6 overflow-y-auto p-6" ref={bodyRef}>
            {/* Proficiency Level */}
            {tech.proficiency && (
              <div>
                <h3 className="mb-3 font-bold font-mono text-muted-foreground text-xs uppercase tracking-widest">
                  Proficiency Level
                </h3>
                <TechProficiencyIndicator
                  proficiency={tech.proficiency}
                  showLabel
                  variant="bar"
                />
              </div>
            )}

            {/* Related Projects */}
            <div>
              <RelatedProjectsList techName={tech.name} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
