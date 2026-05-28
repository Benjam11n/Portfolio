import type { RefObject } from "react";

import { LightweightMarkdown } from "@/components/shared/lightweight-markdown";
import type { Experience } from "@/lib/types";

interface ExperiencePointsProps {
  contentId: string;
  contentRef: RefObject<HTMLDivElement | null>;
  item: Experience;
}

export const ExperiencePoints = ({
  contentId,
  contentRef,
  item,
}: ExperiencePointsProps) => (
  <div
    className="h-0 overflow-hidden opacity-0"
    id={contentId}
    ref={contentRef}
  >
    <div className="pt-4 sm:pl-[72px]">
      <ul className="flex list-none flex-col gap-2">
        {item.points.map((point) => (
          <li
            className="flex items-start gap-2 text-muted-foreground text-sm leading-relaxed"
            key={`${item.id}-point-${point}`}
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40" />
            <LightweightMarkdown>{point}</LightweightMarkdown>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
