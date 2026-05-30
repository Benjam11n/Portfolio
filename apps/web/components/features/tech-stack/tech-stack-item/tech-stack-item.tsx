"use client";

import { EMPTY_SEARCH_TERMS } from "@/components/features/tech-stack/tech-stack-item/constants";
import { TechStackItemContent } from "@/components/features/tech-stack/tech-stack-item/tech-stack-item-content";
import {
  HOVER_CURSOR_ATTRIBUTE,
  HOVER_CURSOR_LABEL_ATTRIBUTE,
} from "@/lib/constants/interaction";
import type { TechStack } from "@/lib/types";

interface TechStackItemProps {
  stack: TechStack;
  small?: boolean;
  onClick?: () => void;
  searchTerms?: string[];
}

export const TechStackItem = ({
  stack,
  small = false,
  onClick,
  searchTerms = EMPTY_SEARCH_TERMS,
}: TechStackItemProps) => {
  const content = (
    <TechStackItemContent
      searchTerms={searchTerms}
      small={small}
      stack={stack}
    />
  );

  if (onClick) {
    return (
      <button
        aria-label={`View details for ${stack.name}`}
        className="flex h-full w-full cursor-pointer items-center rounded-xl border-0 bg-transparent p-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        {...{
          [HOVER_CURSOR_ATTRIBUTE]: "",
          [HOVER_CURSOR_LABEL_ATTRIBUTE]: "Click me!",
        }}
        onClick={onClick}
        type="button"
      >
        {content}
      </button>
    );
  }

  return content;
};
