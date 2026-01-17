"use client";

import gsap from "gsap";
import type { RefObject } from "react";

type ModalAnimationConfig = {
  textY: number;
  textOpacity: number;
  textDuration: number;
  textStagger: number;
  iconScale: number;
  iconRotation: number;
  iconDuration: number;
  contentScale: number;
  contentY: number;
  contentOpacity: number;
  contentDuration: number;
  overlayOpacity: number;
  overlayDuration: number;
  textIconOverlap: string;
  iconContentOverlap: string;
  contentOverlayOverlap: string;
};

type UseModalCloseOptions = {
  overlayRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLElement | null>;
  iconRef: RefObject<HTMLElement | null>;
  textSelector: string;
  animationConfig: ModalAnimationConfig;
  onClose: () => void;
};

export const useModalClose = ({
  overlayRef,
  contentRef,
  iconRef,
  textSelector,
  animationConfig,
  onClose,
}: UseModalCloseOptions) => {
  const handleClose = () => {
    const tl = gsap.timeline({
      onComplete: onClose,
    });

    tl.to(textSelector, {
      y: animationConfig.textY,
      opacity: animationConfig.textOpacity,
      duration: animationConfig.textDuration,
      stagger: animationConfig.textStagger,
    })
      .to(
        iconRef.current,
        {
          scale: animationConfig.iconScale,
          rotation: animationConfig.iconRotation,
          duration: animationConfig.iconDuration,
        },
        animationConfig.textIconOverlap
      )
      .to(
        contentRef.current,
        {
          scale: animationConfig.contentScale,
          y: animationConfig.contentY,
          opacity: animationConfig.contentOpacity,
          duration: animationConfig.contentDuration,
        },
        animationConfig.iconContentOverlap
      )
      .to(
        overlayRef.current,
        {
          opacity: animationConfig.overlayOpacity,
          duration: animationConfig.overlayDuration,
        },
        animationConfig.contentOverlayOverlap
      );
  };

  return handleClose;
};
