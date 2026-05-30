import { TechProficiencyIndicator } from "@/components/features/tech-stack/tech-proficiency-indicator";
import type { TechStack } from "@/lib/types";

interface TechStackProficiencyProps {
  proficiency: TechStack["proficiency"];
}

export const TechStackProficiency = ({
  proficiency,
}: TechStackProficiencyProps) =>
  proficiency ? (
    <div className="mb-1 ml-0.5">
      <TechProficiencyIndicator
        proficiency={proficiency}
        size="sm"
        variant="dots"
      />
    </div>
  ) : null;
