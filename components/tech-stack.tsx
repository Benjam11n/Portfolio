"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { SectionCard } from "@/components/section-card";
import { STACKS } from "@/constants";
import { TechStackItem } from "./tech-stack-item";

export const TechStack = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.set(".tech-item", { autoAlpha: 0, scale: 0.8 });

      gsap.to(".tech-item", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        scale: 1,
        autoAlpha: 1,
        duration: 0.6,
        stagger: 0.05,
        ease: "back.out(1.2)",
      });
    },
    { scope: containerRef }
  );

  return (
    <SectionCard title="Stacks & Skills">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2" ref={containerRef}>
        {STACKS.map((stack) => (
          <TechStackItem key={stack.name} stack={stack} />
        ))}
      </div>
    </SectionCard>
  );
};
