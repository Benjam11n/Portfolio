"use client";

import { useGSAP } from "@gsap/react";
import gsapCore from "gsap";
import { X } from "lucide-react";
import { useCallback, useRef } from "react";

import { BorderedImage } from "@/components/shared/bordered-image";
import { RelatedProjectsList } from "@/components/shared/related-projects-list";
import { TechProficiencyIndicator } from "@/components/shared/tech-proficiency-indicator";
import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";
import type { TechStack } from "@/lib/types";

interface TechDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  tech: TechStack;
}

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
  const handleClose = useCallback(() => {
    if (prefersReducedMotion) {
      onClose();
      return;
    }

    const tl = gsapCore.timeline({
      onComplete: onClose,
    });

    tl.to(bodyRef.current, {
      duration: 0.16,
      opacity: 0,
      y: 10,
    })
      .to(
        headerRef.current,
        {
          duration: 0.16,
          opacity: 0,
          y: -10,
        },
        "-=0.1"
      )
      .to(
        contentRef.current,
        {
          duration: 0.2,
          opacity: 0,
          scale: 0.96,
          y: 16,
        },
        "-=0.1"
      )
      .to(
        overlayRef.current,
        {
          duration: 0.16,
          opacity: 0,
        },
        "-=0.08"
      );
  }, [onClose, prefersReducedMotion]);
  const handleOverlayKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "Escape") {
        handleClose();
      }
    },
    [handleClose]
  );

  useGSAP(
    () => {
      if (!isOpen) {
        return;
      }

      if (prefersReducedMotion) {
        gsapCore.set(overlayRef.current, { opacity: 1 });
        gsapCore.set(contentRef.current, { opacity: 1, scale: 1, y: 0 });
        gsapCore.set(headerRef.current, { opacity: 1, y: 0 });
        gsapCore.set(bodyRef.current, { opacity: 1, y: 0 });
        return;
      }

      const tl = gsapCore.timeline({
        defaults: { ease: "power2.out" },
      });

      // Initial states
      gsapCore.set(overlayRef.current, { opacity: 0 });
      gsapCore.set(contentRef.current, { opacity: 0, scale: 0.96, y: 18 });
      gsapCore.set(headerRef.current, { opacity: 0, y: -12 });
      gsapCore.set(bodyRef.current, { opacity: 0, y: 12 });

      // Animation sequence
      tl.to(overlayRef.current, {
        duration: 0.18,
        opacity: 1,
      })
        .to(
          contentRef.current,
          {
            duration: 0.3,
            ease: "back.out(1.45)",
            opacity: 1,
            scale: 1,
            y: 0,
          },
          "-=0.08"
        )
        .to(
          headerRef.current,
          {
            duration: 0.22,
            opacity: 1,
            y: 0,
          },
          "-=0.22"
        )
        .to(
          bodyRef.current,
          {
            duration: 0.22,
            opacity: 1,
            y: 0,
          },
          "-=0.16"
        );
    },
    { dependencies: [isOpen, prefersReducedMotion], scope: containerRef }
  );

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
        onKeyDown={handleOverlayKeyDown}
        ref={overlayRef}
        type="button"
      />

      {/* Modal Content */}
      <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div
          aria-labelledby={`tech-modal-title-${tech.name}`}
          aria-modal="true"
          className="pointer-events-auto relative w-full max-w-xl rounded-xl bg-card p-1 shadow-xl"
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
                  <h2
                    className="min-w-0 font-semibold text-foreground text-lg sm:text-xl"
                    id={`tech-modal-title-${tech.name}`}
                  >
                    {tech.name}
                  </h2>
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
                  <h3 className="font-bold font-mono text-sm text-muted-foreground uppercase">
                    Proficiency Level
                  </h3>
                  <div className="rounded-xl border border-border/40 bg-background/55">
                    <div className="[&_span]:text-muted-foreground **:[[role=progressbar]]:bg-background">
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
