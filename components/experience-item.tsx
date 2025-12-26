/** biome-ignore-all lint/a11y/noNoninteractiveElementInteractions: Interaction is hover-only */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: Interaction is hover-only */
"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { BorderedImage } from "@/components/bordered-image";
import type { workExperiences } from "@/constants";

type ExperienceItemProps = {
  item: (typeof workExperiences)[0];
};

export const ExperienceItem = ({ item }: ExperienceItemProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const toggleOpen = contextSafe(() => {
    const nextState = !isOpen;
    setIsOpen(nextState);

    if (nextState) {
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
    } else {
      gsap.to(contentRef.current, {
        height: 0,
        duration: 0.3,
        ease: "power2.in",
      });
      gsap.to(contentRef.current, {
        opacity: 0,
        duration: 0.2,
      });
    }
  });

  return (
    <button
      className="group w-full cursor-pointer rounded-2xl bg-card p-4 text-left shadow-sm transition-transform hover:scale-[1.01]"
      onClick={toggleOpen}
      ref={containerRef}
      type="button"
    >
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
            <h3 className="font-bold text-base">{item.name}</h3>
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

      <div
        className="h-0 overflow-hidden opacity-0"
        ref={contentRef}
        style={{ willChange: "height, opacity" }}
      >
        <div className="pt-4 pl-[72px]">
          <p className="text-muted-foreground text-sm leading-relaxed">
            {item.title}
          </p>
        </div>
      </div>
    </button>
  );
};
