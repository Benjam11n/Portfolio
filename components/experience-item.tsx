/** biome-ignore-all lint/a11y/noNoninteractiveElementInteractions: Interaction is hover-only */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: Interaction is hover-only */
"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { BorderedImage } from "@/components/ui/bordered-image";
import type { workExperiences } from "@/constants";

type ExperienceItemProps = {
  item: (typeof workExperiences)[0];
};

export const ExperienceItem = ({ item }: ExperienceItemProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const onEnter = contextSafe(() => {
    gsap.to(contentRef.current, {
      height: "auto",
      duration: 0.4,
      ease: "power2.out",
    });
    gsap.to(contentRef.current, {
      opacity: 1,
      duration: 0.3,
      delay: 0.1,
    });
  });

  const onLeave = contextSafe(() => {
    gsap.to(contentRef.current, {
      height: 0,
      duration: 0.3,
      ease: "power2.in",
    });
    gsap.to(contentRef.current, {
      opacity: 0,
      duration: 0.2,
    });
  });

  return (
    <div
      className="group cursor-pointer rounded-2xl bg-white p-5 shadow-sm transition-transform hover:scale-[1.01]"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      ref={containerRef}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <BorderedImage
            alt={item.name}
            containerClassName="h-14 w-14 shrink-0"
            height={56}
            imageClassName="p-2 object-contain"
            src={item.icon}
            style={{ backgroundColor: "#f3f4f6" }} // Slight gray background to make white border visible
            width={56}
          />
          <div>
            <h3 className="font-bold text-[#0F1419] text-base">{item.name}</h3>
            <p className="font-medium text-[#555555] text-sm">{item.pos}</p>
          </div>
        </div>
        <div className="pl-[72px] sm:pl-0">
          <span className="font-mono font-semibold text-[#555555] text-sm">
            {item.duration}
          </span>
        </div>
      </div>

      <div
        className="h-0 overflow-hidden opacity-0"
        ref={contentRef}
        style={{ willChange: "height, opacity" }}
      >
        <div className="pt-4 pl-[72px]">
          <p className="text-[#555555] text-sm leading-relaxed">{item.title}</p>
        </div>
      </div>
    </div>
  );
};
