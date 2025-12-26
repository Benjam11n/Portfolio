"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { ExperienceItem } from "@/components/shared/experience-item";
import { SectionCard } from "@/components/shared/section-card";
import { workExperiences } from "@/constants/experience";

export const Experience = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".experience-item", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });
    },
    { scope: containerRef }
  );

  return (
    <SectionCard id="experience" title="Experience">
      <div className="flex flex-col gap-4" ref={containerRef}>
        {workExperiences.map((item) => (
          <div className="experience-item" key={item.id}>
            <ExperienceItem item={item} />
          </div>
        ))}
      </div>
    </SectionCard>
  );
};
