"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMemo, useRef, useState } from "react";
import { Card3D } from "@/components/effects/card-3d";
import { BorderedImage } from "@/components/shared/bordered-image";
import { Markdown } from "@/components/shared/markdown";
import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";
import { useMobileDetection } from "@/lib/hooks/utils/use-mobile-detection";
import type { Experience } from "@/lib/types";

type ExperienceItemProps = {
  item: Experience;
};

export const ExperienceItem = ({ item }: ExperienceItemProps) => {
  const containerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const isMobile = useMobileDetection();

  const { contextSafe } = useGSAP({ scope: containerRef });

  const restorePreviousFocus = () => {
    if (
      previousFocusRef.current &&
      typeof previousFocusRef.current.focus === "function"
    ) {
      previousFocusRef.current.focus();
    }
  };

  const expandContent = contextSafe(() => {
    if (!contentRef.current) {
      return;
    }

    if (prefersReducedMotion) {
      contentRef.current.style.height = "auto";
      contentRef.current.style.opacity = "1";
      return;
    }

    gsap.to(contentRef.current, {
      height: "auto",
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(contentRef.current, {
      opacity: 1,
      duration: 0.2,
      delay: 0.1,
    });
  });

  const collapseContent = contextSafe(() => {
    if (!contentRef.current) {
      restorePreviousFocus();
      return;
    }

    if (prefersReducedMotion) {
      contentRef.current.style.height = "0";
      contentRef.current.style.opacity = "0";
      restorePreviousFocus();
      return;
    }

    gsap.to(contentRef.current, {
      height: 0,
      duration: 0.25,
      ease: "power2.in",
    });
    gsap.to(contentRef.current, {
      opacity: 0,
      duration: 0.15,
      onComplete: restorePreviousFocus,
    });
  });

  const toggleOpen = contextSafe(
    (e?: React.MouseEvent | React.KeyboardEvent) => {
      e?.preventDefault();
      const nextState = !isOpen;
      setIsOpen(nextState);

      if (nextState) {
        previousFocusRef.current = document.activeElement as HTMLElement;
        containerRef.current?.focus();
        expandContent();
      } else {
        collapseContent();
      }
    }
  );

  const hasPoints = item.points.length > 0;

  // Generate unique IDs for ARIA attributes - memoized for stability
  const { headingId, contentId } = useMemo(
    () => ({
      headingId: `experience-heading-${item.id}`,
      contentId: `experience-content-${item.id}`,
    }),
    [item.id]
  );

  const content = (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <BorderedImage
          alt={item.name}
          containerClassName="h-14 w-14 shrink-0 bg-muted"
          height={56}
          imageClassName="p-2 object-contain"
          src={item.icon}
          width={56}
        />
        <div>
          <h3 className="font-bold text-base" id={headingId}>
            {item.name}
          </h3>
          <p className="font-medium text-muted-foreground text-sm">
            {item.pos}
          </p>
        </div>
      </div>
      <div className="pl-[72px] sm:pl-0">
        <span className="font-mono font-semibold text-muted-foreground text-sm">
          {item.duration}
        </span>
      </div>
    </div>
  );

  if (!hasPoints) {
    return (
      <Card3D
        className="p-4"
        glare={!isMobile}
        parallaxIntensity={0}
        rotationIntensity={isMobile ? 0 : 5}
        thickness={10}
      >
        <div className="group">{content}</div>
      </Card3D>
    );
  }

  return (
    <Card3D
      className="shadow-sm"
      glare={!isMobile}
      parallaxIntensity={0}
      rotationIntensity={isMobile ? 0 : 5}
      thickness={8}
    >
      <button
        aria-controls={contentId}
        aria-expanded={isOpen}
        aria-labelledby={headingId}
        className="group block w-full cursor-pointer p-4 text-left transition-transform hover:scale-[1.005]"
        onClick={(e) => toggleOpen(e)}
        onKeyDown={(e) => {
          if (e.key === "Escape" && isOpen) {
            toggleOpen(e);
          }
        }}
        ref={containerRef}
        tabIndex={0}
        type="button"
      >
        {content}

        <div
          className="h-0 overflow-hidden opacity-0"
          id={contentId}
          ref={contentRef}
        >
          <div className="pt-4 pl-[72px]">
            <ul className="flex list-none flex-col gap-2">
              {item.points.map((point) => {
                // Render markdown for points
                return (
                  <li
                    className="flex items-start gap-2 text-muted-foreground text-sm leading-relaxed"
                    key={`${item.id}-point-${point}`}
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40" />
                    <Markdown>{point}</Markdown>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </button>
    </Card3D>
  );
};
