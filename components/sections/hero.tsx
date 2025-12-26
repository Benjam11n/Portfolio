"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { BadgeCheck } from "lucide-react";
import { useRef } from "react";
import { BorderedImage } from "@/components/shared/bordered-image";
import { SectionCard } from "@/components/shared/section-card";
import { ShiftButton } from "@/components/shared/shift-button";

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const { isDesktop } = context.conditions as { isDesktop: boolean };
          const offset = isDesktop ? -220 : -40;

          // Image: Scale up from center, smooth pop
          tl.fromTo(
            imageRef.current,
            {
              scale: 0,
              x: offset,
              autoAlpha: 0,
              duration: 0.6,
              ease: "back.out(1.7)",
              transformOrigin: "center center",
            },
            {
              scale: 1,
              x: 0,
              autoAlpha: 1,
              duration: 0.6,
              ease: "back.out(1.7)",
              transformOrigin: "center center",
            }
          );

          tl.fromTo(
            ".hero-text",
            {
              y: 60,
              autoAlpha: 0,
              duration: 0.8,
              stagger: 0.2,
            },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.8,
              stagger: 0.2,
            },
            "-=0.4"
          );

          tl.fromTo(
            buttonsRef.current,
            {
              scale: 0,
              x: offset,
              autoAlpha: 0,
              duration: 0.6,
              ease: "back.out(1.5)",
              transformOrigin: "center center",
            },
            {
              scale: 1,
              x: 0,
              autoAlpha: 1,
              duration: 0.6,
              ease: "back.out(1.5)",
              transformOrigin: "center center",
            },
            "-=0.4"
          );
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <SectionCard id="hero">
      <div ref={containerRef}>
        {/* Profile Image */}
        <div ref={imageRef}>
          <BorderedImage
            alt="Benjamin Wang"
            containerClassName="mb-6 h-[72px] w-[72px]"
            height={72}
            src="/me.png"
            width={72}
          />
        </div>

        {/* Name and Badge */}
        <div className="hero-text mb-2 flex items-center gap-2">
          <h1 className="font-bold text-foreground text-xl tracking-tight sm:text-2xl">
            Benjamin Wang
          </h1>
          <BadgeCheck
            className="h-6 w-6"
            strokeWidth={2.5}
            style={{
              fill: "#1DA1F2",
              color: "white",
            }}
          />
        </div>

        {/* Role */}
        <h2 className="hero-text mb-6 font-medium text-md text-muted-foreground">
          Web Designer
        </h2>

        {/* Description */}
        <p className="hero-text mb-8 max-w-sm font-sans text-foreground text-md leading-relaxed">
          Crafting interactive, user-centered experiences that bring ideas to
          life through thoughtful design and seamless digital execution.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4" ref={buttonsRef}>
          <ShiftButton href="#contact" variant="primary">
            Contact Me
          </ShiftButton>
          <ShiftButton href="#projects" variant="secondary">
            View Projects
          </ShiftButton>
        </div>
      </div>
    </SectionCard>
  );
};
