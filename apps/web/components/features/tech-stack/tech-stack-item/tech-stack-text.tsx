import type { itemSizeConfig } from "@/components/features/tech-stack/tech-stack-item/constants";
import { HighlightedText } from "@/components/features/tech-stack/tech-stack-item/highlighted-text";
import type { TechStack } from "@/lib/types";
import { cn } from "@/lib/utils";

import { TechStackProficiency } from "./tech-stack-proficiency";

type ItemSizeConfig = (typeof itemSizeConfig)[keyof typeof itemSizeConfig];

interface TechStackTextProps {
  config: ItemSizeConfig;
  searchTerms: string[];
  showMeta: boolean;
  stack: TechStack;
}

export const TechStackText = ({
  config,
  searchTerms,
  showMeta,
  stack,
}: TechStackTextProps) => {
  const highlightedTextClass =
    searchTerms.length > 0 && "flex flex-wrap items-center gap-1";

  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 flex-col justify-center",
        config.textOffset
      )}
    >
      <span
        className={cn(
          "w-full truncate font-semibold text-foreground leading-tight",
          highlightedTextClass,
          config.nameClass
        )}
      >
        <HighlightedText searchTerms={searchTerms} text={stack.name} />
      </span>

      {showMeta && (
        <div className="mt-0.5 flex flex-col">
          <TechStackProficiency proficiency={stack.proficiency} />
          <span
            className={cn(
              "w-full truncate font-medium text-muted-foreground text-xs",
              highlightedTextClass
            )}
          >
            <HighlightedText searchTerms={searchTerms} text={stack.category} />
          </span>
        </div>
      )}
    </div>
  );
};
