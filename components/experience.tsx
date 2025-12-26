"use client";

import { SectionCard } from "@/components/section-card";
import { workExperiences } from "@/constants";
import { ExperienceItem } from "./experience-item";

export const Experience = () => {
  return (
    <SectionCard id="experience" title="Experience">
      <div className="flex flex-col gap-4">
        {workExperiences.map((item) => (
          <ExperienceItem item={item} key={item.id} />
        ))}
      </div>
    </SectionCard>
  );
};
