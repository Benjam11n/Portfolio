"use client";

import { useGSAP } from "@gsap/react";
import gsapCore from "gsap";
import type { RefObject } from "react";

export const useProjectHeroAnimation = (
  containerRef: RefObject<HTMLDivElement | null>
) => {
  useGSAP(
    () => {
      gsapCore.set(".hero-back", { autoAlpha: 0, x: -20 });
      gsapCore.set(".hero-logo", { autoAlpha: 0, scale: 0.8 });
      gsapCore.set(".hero-title", { autoAlpha: 0, y: 20 });
      gsapCore.set(".hero-header-item", { autoAlpha: 0, y: 20 });
      gsapCore.set(".hero-visual", {
        autoAlpha: 0,
        scale: 0.98,
        transformOrigin: "center bottom",
      });

      const timeline = gsapCore.timeline({ defaults: { ease: "power3.out" } });

      timeline.to(".hero-back", {
        autoAlpha: 1,
        duration: 0.6,
        x: 0,
      });

      timeline.to(
        [".hero-logo", ".hero-title"],
        {
          autoAlpha: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          scale: 1,
          stagger: 0.1,
          y: 0,
        },
        "-=0.4"
      );

      timeline.to(
        ".hero-header-item",
        {
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.1,
          y: 0,
        },
        "-=0.6"
      );

      timeline.to(
        ".hero-visual",
        {
          autoAlpha: 1,
          duration: 1.2,
          ease: "expo.out",
          scale: 1,
        },
        "-=0.6"
      );
    },
    { scope: containerRef }
  );
};
