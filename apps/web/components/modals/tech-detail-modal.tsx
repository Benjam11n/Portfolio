"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { X } from "lucide-react";
import { useRef } from "react";
import { BorderedImage } from "@/components/shared/bordered-image";
import { RelatedProjectsList } from "@/components/shared/related-projects-list";
import { TechProficiencyIndicator } from "@/components/shared/tech-proficiency-indicator";
import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";
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
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (!isOpen) {
        return;
      }

      if (prefersReducedMotion) {
        gsap.set(overlayRef.current, { opacity: 1 });
        gsap.set(contentRef.current, { scale: 1, y: 0, opacity: 1 });
        gsap.set(headerRef.current, { y: 0, opacity: 1 });
        gsap.set(bodyRef.current, { y: 0, opacity: 1 });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
      });

      // Initial states
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(contentRef.current, { scale: 0.96, y: 18, opacity: 0 });
      gsap.set(headerRef.current, { y: -12, opacity: 0 });
      gsap.set(bodyRef.current, { y: 12, opacity: 0 });

      // Animation sequence
      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.18,
      })
        .to(
          contentRef.current,
          {
            scale: 1,
            y: 0,
            opacity: 1,
            duration: 0.3,
            ease: "back.out(1.45)",
          },
          "-=0.08"
        )
        .to(
          headerRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.22,
          },
          "-=0.22"
        )
        .to(
          bodyRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.22,
          },
          "-=0.16"
        );
    },
    { scope: containerRef, dependencies: [isOpen, prefersReducedMotion] }
  );

  const handleClose = () => {
    if (prefersReducedMotion) {
      onClose();
      return;
    }

    const tl = gsap.timeline({
      onComplete: onClose,
    });

    tl.to(bodyRef.current, {
      y: 10,
      opacity: 0,
      duration: 0.16,
    })
      .to(
        headerRef.current,
        {
          y: -10,
          opacity: 0,
          duration: 0.16,
        },
        "-=0.1"
      )
      .to(
        contentRef.current,
        {
          scale: 0.96,
          y: 16,
          opacity: 0,
          duration: 0.2,
        },
        "-=0.1"
      )
      .to(
        overlayRef.current,
        {
          opacity: 0,
          duration: 0.16,
        },
        "-=0.08"
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
        className="fixed inset-0 z-50 bg-black/70"
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
      <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div
          aria-labelledby={`tech-modal-title-${tech.name}`}
          aria-modal="true"
          className="pointer-events-auto relative w-full max-w-3xl rounded-xl bg-card p-1 shadow-xl"
          ref={contentRef}
          role="dialog"
        >
          <div className="flex max-h-[90vh] flex-col overflow-hidden rounded-xl border border-border/40 bg-muted text-foreground">
            {/* Header */}
            <div
              className="flex items-start justify-between p-4 pb-0 sm:p-6 sm:pb-0"
              ref={headerRef}
            >
              <div className="min-w-0">
                <div className="mb-4">
                  <h2
                    className="font-bold font-mono text-foreground text-md uppercase"
                    id={`tech-modal-title-${tech.name}`}
                  >
                    Stacks & Skills
                  </h2>
                </div>
                <div className="flex min-w-0 items-center gap-4">
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
                  <div className="min-w-0">
                    <p className="text-muted-foreground text-sm">
                      {tech.category}
                    </p>
                    <p className="text-foreground text-xl sm:text-2xl">
                      {tech.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                aria-label="Close modal"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/40 bg-background/60 transition-colors hover:bg-background"
                onClick={handleClose}
                type="button"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Body */}
            <div
              className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-6"
              ref={bodyRef}
            >
              {/* Proficiency Level */}
              {tech.proficiency && (
                <div className="space-y-3">
                  <h3 className="font-bold font-mono text-foreground text-md uppercase">
                    Proficiency Level
                  </h3>
                  <div className="rounded-xl border border-border/40 bg-background/55 p-4">
                    <div className="[&_[role=progressbar]]:bg-background [&_span]:text-muted-foreground">
                      <TechProficiencyIndicator
                        proficiency={tech.proficiency}
                        showLabel
                        variant="bar"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Related Projects */}
              <div className="space-y-3">
                <RelatedProjectsList techName={tech.name} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
