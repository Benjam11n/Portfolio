import { ExperienceItem } from "@/components/features/experience/experience-item";
import { ExperienceReveal } from "@/components/sections/experience-reveal";
import { SectionCard } from "@/components/shared/section-card";
import { workExperiences } from "@/lib/constants/experience";

export const Experience = () => (
  <SectionCard id="experience" title="Experience">
    <ExperienceReveal>
      {workExperiences.map((item) => (
        <div className="experience-item" key={item.id}>
          <ExperienceItem item={item} />
        </div>
      ))}
    </ExperienceReveal>
  </SectionCard>
);
