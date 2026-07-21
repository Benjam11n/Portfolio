import { ExperienceExpandIcon } from "@/components/features/experience/experience-item/experience-expand-icon";
import { ExperienceIcon } from "@/components/features/experience/experience-item/experience-icon";
import type { Experience } from "@/lib/types";

interface ExperienceSummaryProps {
  durationLabel: string;
  hasPoints: boolean;
  headingId: string;
  isOpen: boolean;
  item: Experience;
  shouldReduceMotion: boolean;
}

export const ExperienceSummary = ({
  durationLabel,
  hasPoints,
  headingId,
  isOpen,
  item,
  shouldReduceMotion,
}: ExperienceSummaryProps) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-center gap-3">
      <ExperienceIcon item={item} shouldReduceMotion={shouldReduceMotion} />
      <div>
        <h3 className="font-bold text-base" id={headingId}>
          {item.name}
        </h3>
        <p className="font-medium text-muted-foreground text-sm">{item.pos}</p>
      </div>
    </div>
    <div className="pl-[72px] sm:pl-0">
      <div className="flex items-center gap-2 sm:justify-end">
        <span className="font-mono font-semibold text-muted-foreground text-sm">
          {durationLabel}
        </span>
        {hasPoints && (
          <span className="hidden h-8 w-8 items-center justify-center text-muted-foreground transition-all sm:inline-flex">
            <ExperienceExpandIcon isOpen={isOpen} />
          </span>
        )}
      </div>
    </div>
  </div>
);
