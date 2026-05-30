"use client";

import { useGSAP } from "@gsap/react";
import gsapCore from "gsap";
import { useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent } from "react";

import { EXPERIENCE_EXPAND_ANIMATION } from "@/components/features/experience/experience-item/constants";

interface UseExperienceExpandOptions {
  prefersReducedMotion: boolean;
}

export const useExperienceExpand = ({
  prefersReducedMotion,
}: UseExperienceExpandOptions) => {
  const containerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
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

    gsapCore.to(contentRef.current, {
      duration: EXPERIENCE_EXPAND_ANIMATION.expandDuration,
      ease: "power2.out",
      height: "auto",
    });
    gsapCore.to(contentRef.current, {
      delay: EXPERIENCE_EXPAND_ANIMATION.contentDelay,
      duration: EXPERIENCE_EXPAND_ANIMATION.contentDuration,
      opacity: 1,
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

    gsapCore.to(contentRef.current, {
      duration: EXPERIENCE_EXPAND_ANIMATION.collapseDuration,
      ease: "power2.in",
      height: 0,
    });
    gsapCore.to(contentRef.current, {
      duration: EXPERIENCE_EXPAND_ANIMATION.collapseOpacityDuration,
      onComplete: restorePreviousFocus,
      opacity: 0,
    });
  });

  const toggleOpen = contextSafe((event?: MouseEvent | KeyboardEvent) => {
    event?.preventDefault();
    const nextState = !isOpen;
    setIsOpen(nextState);

    if (nextState) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      containerRef.current?.focus();
      expandContent();
    } else {
      collapseContent();
    }
  });

  const handleButtonClick = contextSafe((event: MouseEvent) => {
    toggleOpen(event);
  });

  const handleButtonKeyDown = contextSafe((event: KeyboardEvent) => {
    if (event.key === "Escape" && isOpen) {
      toggleOpen(event);
    }
  });

  return {
    contentRef,
    handleButtonClick,
    handleButtonKeyDown,
    isOpen,
    triggerRef: containerRef,
  };
};
